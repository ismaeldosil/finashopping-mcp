/**
 * Tests for MCP Tools registration
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// Mock API client
vi.mock('../../src/api/client.js', () => ({
  fetchLoans: vi.fn().mockResolvedValue({ loans: [] }),
  fetchCreditCards: vi.fn().mockResolvedValue({ creditCards: [] }),
  fetchInsurances: vi.fn().mockResolvedValue({ insurances: [] }),
  fetchGuarantees: vi.fn().mockResolvedValue({ guarantees: [] }),
  fetchBenefits: vi.fn().mockResolvedValue({ benefits: [] }),
}));

// Create mock server for testing
function createMockServer() {
  const tools: Map<string, unknown> = new Map();

  return {
    tool: vi.fn(
      (name: string, _desc: string, _schema: unknown, handler: unknown) => {
        tools.set(name, handler);
      }
    ),
    getTool: (name: string) => tools.get(name),
    tools,
  };
}

describe('Loan Tools Registration', () => {
  let mockServer: ReturnType<typeof createMockServer>;

  beforeEach(() => {
    mockServer = createMockServer();
    vi.clearAllMocks();
  });

  it('should register search-loans tool', async () => {
    const { registerLoanTools } = await import('../../src/tools/loans.js');
    registerLoanTools(mockServer as unknown as McpServer);

    expect(mockServer.tool).toHaveBeenCalledWith(
      'search-loans',
      expect.any(String),
      expect.any(Object),
      expect.any(Function)
    );
  });

  it('should register calculate-loan-payment tool', async () => {
    const { registerLoanTools } = await import('../../src/tools/loans.js');
    registerLoanTools(mockServer as unknown as McpServer);

    expect(mockServer.tool).toHaveBeenCalledWith(
      'calculate-loan-payment',
      expect.any(String),
      expect.any(Object),
      expect.any(Function)
    );
  });

  it('should register compare-loans tool', async () => {
    const { registerLoanTools } = await import('../../src/tools/loans.js');
    registerLoanTools(mockServer as unknown as McpServer);

    expect(mockServer.tool).toHaveBeenCalledWith(
      'compare-loans',
      expect.any(String),
      expect.any(Object),
      expect.any(Function)
    );
  });

  it('should register get-loan-requirements tool', async () => {
    const { registerLoanTools } = await import('../../src/tools/loans.js');
    registerLoanTools(mockServer as unknown as McpServer);

    expect(mockServer.tool).toHaveBeenCalledWith(
      'get-loan-requirements',
      expect.any(String),
      expect.any(Object),
      expect.any(Function)
    );
  });

  it('should register all 4 loan tools', async () => {
    const { registerLoanTools } = await import('../../src/tools/loans.js');
    registerLoanTools(mockServer as unknown as McpServer);

    expect(mockServer.tool).toHaveBeenCalledTimes(4);
  });
});

describe('Card Tools Registration', () => {
  let mockServer: ReturnType<typeof createMockServer>;

  beforeEach(() => {
    mockServer = createMockServer();
    vi.clearAllMocks();
  });

  it('should register search-credit-cards tool', async () => {
    const { registerCardTools } = await import('../../src/tools/cards.js');
    registerCardTools(mockServer as unknown as McpServer);

    expect(mockServer.tool).toHaveBeenCalledWith(
      'search-credit-cards',
      expect.any(String),
      expect.any(Object),
      expect.any(Function)
    );
  });

  it('should register get-card-details tool', async () => {
    const { registerCardTools } = await import('../../src/tools/cards.js');
    registerCardTools(mockServer as unknown as McpServer);

    expect(mockServer.tool).toHaveBeenCalledWith(
      'get-card-details',
      expect.any(String),
      expect.any(Object),
      expect.any(Function)
    );
  });

  it('should register all 2 card tools', async () => {
    const { registerCardTools } = await import('../../src/tools/cards.js');
    registerCardTools(mockServer as unknown as McpServer);

    expect(mockServer.tool).toHaveBeenCalledTimes(2);
  });
});

describe('Insurance Tools Registration', () => {
  let mockServer: ReturnType<typeof createMockServer>;

  beforeEach(() => {
    mockServer = createMockServer();
    vi.clearAllMocks();
  });

  it('should register search-insurances tool', async () => {
    const { registerInsuranceTools } = await import(
      '../../src/tools/insurance.js'
    );
    registerInsuranceTools(mockServer as unknown as McpServer);

    expect(mockServer.tool).toHaveBeenCalledWith(
      'search-insurances',
      expect.any(String),
      expect.any(Object),
      expect.any(Function)
    );
  });

  it('should register search-guarantees tool', async () => {
    const { registerInsuranceTools } = await import(
      '../../src/tools/insurance.js'
    );
    registerInsuranceTools(mockServer as unknown as McpServer);

    expect(mockServer.tool).toHaveBeenCalledWith(
      'search-guarantees',
      expect.any(String),
      expect.any(Object),
      expect.any(Function)
    );
  });

  it('should register get-benefits tool', async () => {
    const { registerInsuranceTools } = await import(
      '../../src/tools/insurance.js'
    );
    registerInsuranceTools(mockServer as unknown as McpServer);

    expect(mockServer.tool).toHaveBeenCalledWith(
      'get-benefits',
      expect.any(String),
      expect.any(Object),
      expect.any(Function)
    );
  });

  it('should register all 3 insurance tools', async () => {
    const { registerInsuranceTools } = await import(
      '../../src/tools/insurance.js'
    );
    registerInsuranceTools(mockServer as unknown as McpServer);

    expect(mockServer.tool).toHaveBeenCalledTimes(3);
  });
});

describe('All Tools Registration', () => {
  let mockServer: ReturnType<typeof createMockServer>;

  beforeEach(() => {
    mockServer = createMockServer();
    vi.clearAllMocks();
  });

  it('should register all tools via registerAllTools', async () => {
    const { registerAllTools } = await import('../../src/tools/index.js');
    registerAllTools(mockServer as unknown as McpServer);

    // 4 loan + 2 card + 3 insurance = 9 tools
    expect(mockServer.tool).toHaveBeenCalledTimes(9);
  });
});
