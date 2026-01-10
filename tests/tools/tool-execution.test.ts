/**
 * Tests for MCP Tool execution (actual handler invocation)
 * These tests verify the tool handlers work correctly with mocked data
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// Mock API client with inline data (must be self-contained for vi.mock hoisting)
vi.mock('../../src/api/client.js', () => {
  // Define mock data inside factory to avoid hoisting issues
  const loans = [
    {
      id: 1,
      name: 'Préstamo Personal BROU',
      institution: 'BROU',
      amount: 150000,
      currency: '$U',
      rate: 28,
      term: 36,
      monthlyPayment: 5850,
      probability: 'alta',
      features: ['Sin comisiones', 'Tasa fija'],
    },
    {
      id: 2,
      name: 'Préstamo Auto Santander',
      institution: 'Santander',
      amount: 800000,
      currency: '$U',
      rate: 32,
      term: 60,
      monthlyPayment: 22400,
      probability: 'media',
      features: ['Seguro incluido'],
    },
    {
      id: 3,
      name: 'Préstamo Hipotecario Itaú',
      institution: 'Itaú',
      amount: 3000000,
      currency: 'USD',
      rate: 8.5,
      term: 240,
      monthlyPayment: 25650,
      probability: 'baja',
      features: ['Hasta 80% financiación'],
    },
  ];

  const creditCards = [
    {
      id: 1,
      name: 'OCA Blue',
      issuer: 'OCA',
      network: 'OCA',
      limit: 100000,
      currency: '$U',
      annualFee: 0,
      benefits: ['Sin costo anual'],
      recommendation: 'Ideal para comenzar',
    },
    {
      id: 2,
      name: 'Visa Gold Santander',
      issuer: 'Santander',
      network: 'Visa',
      limit: 300000,
      currency: '$U',
      annualFee: 2500,
      benefits: ['Millas', 'Seguro viaje'],
      recommendation: 'Para viajeros frecuentes',
    },
    {
      id: 3,
      name: 'Mastercard Black',
      issuer: 'Itaú',
      network: 'Mastercard',
      limit: 500000,
      currency: 'USD',
      annualFee: 150,
      benefits: ['Concierge', 'Priority Pass'],
      recommendation: 'Premium',
    },
  ];

  const insurances = [
    {
      id: 1,
      type: 'Auto',
      provider: 'BSE',
      coverage: 'Todo riesgo',
      monthlyPremium: 2500,
      features: ['Grúa 24/7', 'Auto sustituto'],
    },
    {
      id: 2,
      type: 'Hogar',
      provider: 'Mapfre',
      coverage: 'Incendio y robo',
      monthlyPremium: 1200,
      features: ['Cobertura contenido'],
    },
    {
      id: 3,
      type: 'Vida',
      provider: 'Sura',
      coverage: 'Fallecimiento',
      monthlyPremium: 800,
      features: ['Doble indemnización'],
    },
  ];

  const guarantees = [
    {
      id: 1,
      type: 'Alquiler',
      provider: 'Porto Seguro',
      coverage: '24 meses',
      requirements: ['Recibo de sueldo', 'Cédula'],
      monthlyFee: 1500,
      description: 'Garantía de alquiler sin depósito',
    },
    {
      id: 2,
      type: 'Alquiler',
      provider: 'ANDA',
      coverage: '12 meses',
      requirements: ['Clearing limpio'],
      monthlyFee: 1200,
      description: 'Garantía rápida',
    },
  ];

  const benefits = [
    {
      id: 1,
      title: '20% en Supermercados',
      description: 'Descuento en compras',
      discount: '20%',
      category: 'Alimentación',
      validUntil: '2025-12-31',
    },
    {
      id: 2,
      title: '2x1 en Cines',
      description: 'Entradas de cine',
      discount: '50%',
      category: 'Entretenimiento',
      validUntil: '2025-12-31',
    },
  ];

  return {
    fetchLoans: vi.fn().mockResolvedValue({ loans }),
    fetchCreditCards: vi.fn().mockResolvedValue({ creditCards }),
    fetchInsurances: vi.fn().mockResolvedValue({ insurances }),
    fetchGuarantees: vi.fn().mockResolvedValue({ guarantees }),
    fetchBenefits: vi.fn().mockResolvedValue({ benefits }),
  };
});

// Helper to capture tool handlers
type ToolHandler = (args: Record<string, unknown>) => Promise<{
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}>;

function createToolCapturingServer() {
  const handlers: Map<string, ToolHandler> = new Map();

  return {
    tool: vi.fn(
      (name: string, _desc: string, _schema: unknown, handler: ToolHandler) => {
        handlers.set(name, handler);
      }
    ),
    getHandler: (name: string) => handlers.get(name),
    handlers,
  };
}

describe('Loan Tool Execution', () => {
  let mockServer: ReturnType<typeof createToolCapturingServer>;

  beforeEach(async () => {
    mockServer = createToolCapturingServer();
    vi.clearAllMocks();

    const { registerLoanTools } = await import('../../src/tools/loans.js');
    registerLoanTools(mockServer as unknown as McpServer);
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe('search-loans', () => {
    it('should return all loans when no filters are provided', async () => {
      const handler = mockServer.getHandler('search-loans');
      expect(handler).toBeDefined();

      const result = await handler!({});
      expect(result.content).toHaveLength(1);

      const data = JSON.parse(result.content[0].text);
      expect(data.loans).toHaveLength(3);
      expect(data.count).toBe(3);
    });

    it('should filter loans by amount range', async () => {
      const handler = mockServer.getHandler('search-loans');

      // Amount 150000 should match loans within 75000-300000 range
      const result = await handler!({ amount: 150000 });
      const data = JSON.parse(result.content[0].text);

      expect(data.filters.amount).toBe(150000);
      expect(data.loans.some((l: { name: string }) => l.name.includes('Personal'))).toBe(true);
    });

    it('should filter loans by type personal', async () => {
      const handler = mockServer.getHandler('search-loans');

      const result = await handler!({ type: 'personal' });
      const data = JSON.parse(result.content[0].text);

      expect(data.loans.every((l: { name: string }) =>
        l.name.toLowerCase().includes('personal')
      )).toBe(true);
    });

    it('should filter loans by type auto', async () => {
      const handler = mockServer.getHandler('search-loans');

      const result = await handler!({ type: 'auto' });
      const data = JSON.parse(result.content[0].text);

      expect(data.loans.every((l: { name: string }) =>
        l.name.toLowerCase().includes('auto')
      )).toBe(true);
    });

    it('should filter loans by type hipotecario', async () => {
      const handler = mockServer.getHandler('search-loans');

      const result = await handler!({ type: 'hipotecario' });
      const data = JSON.parse(result.content[0].text);

      expect(data.loans.every((l: { name: string }) =>
        l.name.toLowerCase().includes('hipotec')
      )).toBe(true);
    });

    it('should filter loans by term range', async () => {
      const handler = mockServer.getHandler('search-loans');

      const result = await handler!({ term: 36 });
      const data = JSON.parse(result.content[0].text);

      expect(data.filters.term).toBe(36);
    });

    it('should combine multiple filters', async () => {
      const handler = mockServer.getHandler('search-loans');

      const result = await handler!({ amount: 150000, type: 'personal', term: 36 });
      const data = JSON.parse(result.content[0].text);

      expect(data.filters.amount).toBe(150000);
      expect(data.filters.type).toBe('personal');
      expect(data.filters.term).toBe(36);
    });
  });

  describe('calculate-loan-payment', () => {
    it('should calculate payment for a loan', async () => {
      const handler = mockServer.getHandler('calculate-loan-payment');
      expect(handler).toBeDefined();

      const result = await handler!({ amount: 100000, rate: 24, term: 12 });
      const data = JSON.parse(result.content[0].text);

      expect(data.principal).toBe(100000);
      expect(data.annualRate).toBe(24);
      expect(data.termMonths).toBe(12);
      expect(data.monthlyPayment).toBeGreaterThan(0);
      expect(data.totalAmount).toBeGreaterThan(data.principal);
      expect(data.totalInterest).toBeGreaterThan(0);
      expect(data.currency).toBe('$U');
    });

    it('should handle zero interest rate', async () => {
      const handler = mockServer.getHandler('calculate-loan-payment');

      const result = await handler!({ amount: 120000, rate: 0, term: 12 });
      const data = JSON.parse(result.content[0].text);

      expect(data.monthlyPayment).toBe(10000); // 120000 / 12
      expect(data.totalInterest).toBe(0);
    });

    it('should calculate correct total for high interest', async () => {
      const handler = mockServer.getHandler('calculate-loan-payment');

      const result = await handler!({ amount: 100000, rate: 48, term: 24 });
      const data = JSON.parse(result.content[0].text);

      expect(data.totalAmount).toBeGreaterThan(data.principal);
      expect(data.totalInterest).toBeGreaterThan(0);
    });
  });

  describe('compare-loans', () => {
    it('should compare multiple loans', async () => {
      const handler = mockServer.getHandler('compare-loans');
      expect(handler).toBeDefined();

      const result = await handler!({ loanIds: [1, 2] });
      const data = JSON.parse(result.content[0].text);

      expect(data.comparison).toHaveLength(2);
      expect(data.recommendations).toBeDefined();
      expect(data.recommendations.lowestRate).toBeDefined();
      expect(data.recommendations.lowestPayment).toBeDefined();
    });

    it('should return error when less than 2 loans found', async () => {
      const handler = mockServer.getHandler('compare-loans');

      const result = await handler!({ loanIds: [999, 998] });
      const data = JSON.parse(result.content[0].text);

      expect(result.isError).toBe(true);
      expect(data.error).toBeDefined();
      expect(data.validIds).toBeDefined();
    });

    it('should identify recommendations correctly', async () => {
      const handler = mockServer.getHandler('compare-loans');

      const result = await handler!({ loanIds: [1, 2, 3] });
      const data = JSON.parse(result.content[0].text);

      expect(data.recommendations.lowestRate.id).toBe(3); // Hipotecario at 8.5%
      expect(data.recommendations.lowestPayment.id).toBe(1); // Personal at 5850
    });
  });

  describe('get-loan-requirements', () => {
    it('should return requirements for personal loan', async () => {
      const handler = mockServer.getHandler('get-loan-requirements');
      expect(handler).toBeDefined();

      const result = await handler!({ loanId: 1 });
      const data = JSON.parse(result.content[0].text);

      expect(data.loan.name).toContain('Personal');
      expect(data.requirements.documentation.length).toBeGreaterThan(0);
      expect(data.requirements.income).toBeDefined();
      expect(data.requirements.approval).toBeDefined();
    });

    it('should return requirements for auto loan', async () => {
      const handler = mockServer.getHandler('get-loan-requirements');

      const result = await handler!({ loanId: 2 });
      const data = JSON.parse(result.content[0].text);

      expect(data.loan.name.toLowerCase()).toContain('auto');
      // Auto loans have specific requirements
      expect(data.requirements.documentation.some((r: string) =>
        r.toLowerCase().includes('vehículo') || r.toLowerCase().includes('vehicle')
      )).toBe(true);
    });

    it('should return requirements for hipotecario loan', async () => {
      const handler = mockServer.getHandler('get-loan-requirements');

      const result = await handler!({ loanId: 3 });
      const data = JSON.parse(result.content[0].text);

      expect(data.loan.name.toLowerCase()).toContain('hipotec');
      // Hipotecario loans have property-related requirements
      expect(data.requirements.documentation.some((r: string) =>
        r.toLowerCase().includes('tasación') || r.toLowerCase().includes('appraisal')
      )).toBe(true);
    });

    it('should return error for non-existent loan', async () => {
      const handler = mockServer.getHandler('get-loan-requirements');

      const result = await handler!({ loanId: 999 });
      const data = JSON.parse(result.content[0].text);

      expect(result.isError).toBe(true);
      expect(data.error).toBeDefined();
      expect(data.validIds).toBeDefined();
    });
  });
});

describe('Card Tool Execution', () => {
  let mockServer: ReturnType<typeof createToolCapturingServer>;

  beforeEach(async () => {
    mockServer = createToolCapturingServer();
    vi.clearAllMocks();

    const { registerCardTools } = await import('../../src/tools/cards.js');
    registerCardTools(mockServer as unknown as McpServer);
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe('search-credit-cards', () => {
    it('should return all cards when no filters', async () => {
      const handler = mockServer.getHandler('search-credit-cards');
      expect(handler).toBeDefined();

      const result = await handler!({});
      const data = JSON.parse(result.content[0].text);

      expect(data.creditCards).toHaveLength(3);
      expect(data.count).toBe(3);
    });

    it('should filter cards by network', async () => {
      const handler = mockServer.getHandler('search-credit-cards');

      const result = await handler!({ network: 'Visa' });
      const data = JSON.parse(result.content[0].text);

      expect(data.creditCards.every((c: { network: string }) => c.network === 'Visa')).toBe(true);
    });

    it('should filter cards by max annual fee', async () => {
      const handler = mockServer.getHandler('search-credit-cards');

      const result = await handler!({ maxAnnualFee: 0 });
      const data = JSON.parse(result.content[0].text);

      expect(data.creditCards.every((c: { annualFee: number }) => c.annualFee <= 0)).toBe(true);
    });
  });

  describe('get-card-details', () => {
    it('should return details for existing card', async () => {
      const handler = mockServer.getHandler('get-card-details');
      expect(handler).toBeDefined();

      const result = await handler!({ cardId: 1 });
      const data = JSON.parse(result.content[0].text);

      expect(data.card).toBeDefined();
      expect(data.card.name).toBe('OCA Blue');
      expect(data.card.benefits).toBeDefined();
    });

    it('should return error for non-existent card', async () => {
      const handler = mockServer.getHandler('get-card-details');

      const result = await handler!({ cardId: 999 });
      const data = JSON.parse(result.content[0].text);

      expect(result.isError).toBe(true);
      expect(data.error).toBeDefined();
    });
  });
});

describe('Insurance Tool Execution', () => {
  let mockServer: ReturnType<typeof createToolCapturingServer>;

  beforeEach(async () => {
    mockServer = createToolCapturingServer();
    vi.clearAllMocks();

    const { registerInsuranceTools } = await import('../../src/tools/insurance.js');
    registerInsuranceTools(mockServer as unknown as McpServer);
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe('search-insurances', () => {
    it('should return all insurances when no filters', async () => {
      const handler = mockServer.getHandler('search-insurances');
      expect(handler).toBeDefined();

      const result = await handler!({});
      const data = JSON.parse(result.content[0].text);

      expect(data.insurances).toHaveLength(3);
    });

    it('should filter by insurance type', async () => {
      const handler = mockServer.getHandler('search-insurances');

      const result = await handler!({ type: 'Auto' });
      const data = JSON.parse(result.content[0].text);

      expect(data.insurances.every((i: { type: string }) => i.type === 'Auto')).toBe(true);
    });
  });

  describe('search-guarantees', () => {
    it('should return all guarantees', async () => {
      const handler = mockServer.getHandler('search-guarantees');
      expect(handler).toBeDefined();

      const result = await handler!({});
      const data = JSON.parse(result.content[0].text);

      expect(data.guarantees).toHaveLength(2);
    });
  });

  describe('get-benefits', () => {
    it('should return all benefits', async () => {
      const handler = mockServer.getHandler('get-benefits');
      expect(handler).toBeDefined();

      const result = await handler!({});
      const data = JSON.parse(result.content[0].text);

      expect(data.benefits).toHaveLength(2);
    });

    it('should filter benefits by category', async () => {
      const handler = mockServer.getHandler('get-benefits');

      const result = await handler!({ category: 'Alimentación' });
      const data = JSON.parse(result.content[0].text);

      expect(data.benefits.every((b: { category: string }) =>
        b.category === 'Alimentación'
      )).toBe(true);
    });
  });
});
