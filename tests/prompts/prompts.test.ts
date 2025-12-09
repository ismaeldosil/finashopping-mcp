/**
 * Tests for MCP Prompts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// Mock server for testing prompts
function createMockServer() {
  const prompts: Map<string, unknown> = new Map();

  return {
    prompt: vi.fn((name: string, _desc: string, _schema: unknown, handler: unknown) => {
      prompts.set(name, handler);
    }),
    getPrompt: (name: string) => prompts.get(name),
    prompts,
  };
}

describe('Prompt Registration', () => {
  let mockServer: ReturnType<typeof createMockServer>;

  beforeEach(() => {
    mockServer = createMockServer();
    vi.clearAllMocks();
  });

  it('should register loan-application-guide prompt', async () => {
    const { registerLoanGuidePrompt } = await import(
      '../../src/prompts/loan-guide.js'
    );
    registerLoanGuidePrompt(mockServer as unknown as McpServer);

    expect(mockServer.prompt).toHaveBeenCalledWith(
      'loan-application-guide',
      expect.any(String),
      expect.any(Object),
      expect.any(Function)
    );
  });

  it('should register credit-tips prompt', async () => {
    const { registerCreditTipsPrompt } = await import(
      '../../src/prompts/credit-tips.js'
    );
    registerCreditTipsPrompt(mockServer as unknown as McpServer);

    expect(mockServer.prompt).toHaveBeenCalledWith(
      'improve-credit-score',
      expect.any(String),
      expect.any(Object),
      expect.any(Function)
    );
  });

  it('should register comparison prompt', async () => {
    const { registerComparisonPrompt } = await import(
      '../../src/prompts/comparison.js'
    );
    registerComparisonPrompt(mockServer as unknown as McpServer);

    expect(mockServer.prompt).toHaveBeenCalledWith(
      'product-comparison',
      expect.any(String),
      expect.any(Object),
      expect.any(Function)
    );
  });

  it('should register faq prompt', async () => {
    const { registerFaqPrompt } = await import('../../src/prompts/faq.js');
    registerFaqPrompt(mockServer as unknown as McpServer);

    expect(mockServer.prompt).toHaveBeenCalledWith(
      'financial-faq',
      expect.any(String),
      expect.any(Object),
      expect.any(Function)
    );
  });
});

describe('Loan Guide Prompt', () => {
  it('should generate prompt with loan type', async () => {
    const mockServer = createMockServer();
    const { registerLoanGuidePrompt } = await import(
      '../../src/prompts/loan-guide.js'
    );
    registerLoanGuidePrompt(mockServer as unknown as McpServer);

    const handler = mockServer.getPrompt('loan-application-guide') as (
      args: { loanType: string; amount?: string; term?: string }
    ) => { messages: Array<{ role: string; content: { type: string; text: string } }> };

    const result = handler({ loanType: 'personal' });

    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].role).toBe('user');
    expect(result.messages[0].content.text).toContain('personal');
  });

  it('should include amount when provided', async () => {
    const mockServer = createMockServer();
    const { registerLoanGuidePrompt } = await import(
      '../../src/prompts/loan-guide.js'
    );
    registerLoanGuidePrompt(mockServer as unknown as McpServer);

    const handler = mockServer.getPrompt('loan-application-guide') as (
      args: { loanType: string; amount?: string; term?: string }
    ) => { messages: Array<{ role: string; content: { type: string; text: string } }> };

    const result = handler({ loanType: 'personal', amount: '500000' });

    expect(result.messages[0].content.text).toContain('500');
  });

  it('should include term when provided', async () => {
    const mockServer = createMockServer();
    const { registerLoanGuidePrompt } = await import(
      '../../src/prompts/loan-guide.js'
    );
    registerLoanGuidePrompt(mockServer as unknown as McpServer);

    const handler = mockServer.getPrompt('loan-application-guide') as (
      args: { loanType: string; amount?: string; term?: string }
    ) => { messages: Array<{ role: string; content: { type: string; text: string } }> };

    const result = handler({ loanType: 'auto', term: '48' });

    expect(result.messages[0].content.text).toContain('48 months');
  });
});

describe('Credit Tips Prompt', () => {
  it('should generate prompt with score range', async () => {
    const mockServer = createMockServer();
    const { registerCreditTipsPrompt } = await import(
      '../../src/prompts/credit-tips.js'
    );
    registerCreditTipsPrompt(mockServer as unknown as McpServer);

    const handler = mockServer.getPrompt('improve-credit-score') as (
      args: { currentScore?: string; concerns?: string }
    ) => { messages: Array<{ role: string; content: { type: string; text: string } }> };

    const result = handler({ currentScore: '650' });

    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].content.text).toContain('score');
  });

  it('should generate prompt without score', async () => {
    const mockServer = createMockServer();
    const { registerCreditTipsPrompt } = await import(
      '../../src/prompts/credit-tips.js'
    );
    registerCreditTipsPrompt(mockServer as unknown as McpServer);

    const handler = mockServer.getPrompt('improve-credit-score') as (
      args: { currentScore?: string; concerns?: string }
    ) => { messages: Array<{ role: string; content: { type: string; text: string } }> };

    const result = handler({});

    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].content.text).toContain('score');
  });

  it('should include concerns when provided', async () => {
    const mockServer = createMockServer();
    const { registerCreditTipsPrompt } = await import(
      '../../src/prompts/credit-tips.js'
    );
    registerCreditTipsPrompt(mockServer as unknown as McpServer);

    const handler = mockServer.getPrompt('improve-credit-score') as (
      args: { currentScore?: string; concerns?: string }
    ) => { messages: Array<{ role: string; content: { type: string; text: string } }> };

    const result = handler({ concerns: 'deudas en clearing' });

    expect(result.messages[0].content.text).toContain('deudas en clearing');
  });
});

describe('Comparison Prompt', () => {
  it('should generate comparison prompt for préstamos', async () => {
    const mockServer = createMockServer();
    const { registerComparisonPrompt } = await import(
      '../../src/prompts/comparison.js'
    );
    registerComparisonPrompt(mockServer as unknown as McpServer);

    const handler = mockServer.getPrompt('product-comparison') as (
      args: { productType: string; priorities?: string }
    ) => { messages: Array<{ role: string; content: { type: string; text: string } }> };

    const result = handler({ productType: 'préstamos' });

    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].content.text).toContain('préstamos');
  });

  it('should generate comparison prompt for prestamos (without accent)', async () => {
    const mockServer = createMockServer();
    const { registerComparisonPrompt } = await import(
      '../../src/prompts/comparison.js'
    );
    registerComparisonPrompt(mockServer as unknown as McpServer);

    const handler = mockServer.getPrompt('product-comparison') as (
      args: { productType: string; priorities?: string }
    ) => { messages: Array<{ role: string; content: { type: string; text: string } }> };

    const result = handler({ productType: 'prestamos' });

    expect(result.messages[0].content.text).toContain('search-loans');
  });

  it('should generate comparison prompt for loans', async () => {
    const mockServer = createMockServer();
    const { registerComparisonPrompt } = await import(
      '../../src/prompts/comparison.js'
    );
    registerComparisonPrompt(mockServer as unknown as McpServer);

    const handler = mockServer.getPrompt('product-comparison') as (
      args: { productType: string; priorities?: string }
    ) => { messages: Array<{ role: string; content: { type: string; text: string } }> };

    const result = handler({ productType: 'loans' });

    expect(result.messages[0].content.text).toContain('search-loans');
  });

  it('should generate comparison prompt for tarjetas', async () => {
    const mockServer = createMockServer();
    const { registerComparisonPrompt } = await import(
      '../../src/prompts/comparison.js'
    );
    registerComparisonPrompt(mockServer as unknown as McpServer);

    const handler = mockServer.getPrompt('product-comparison') as (
      args: { productType: string; priorities?: string }
    ) => { messages: Array<{ role: string; content: { type: string; text: string } }> };

    const result = handler({ productType: 'tarjetas' });

    expect(result.messages[0].content.text).toContain('search-credit-cards');
  });

  it('should generate comparison prompt for cards', async () => {
    const mockServer = createMockServer();
    const { registerComparisonPrompt } = await import(
      '../../src/prompts/comparison.js'
    );
    registerComparisonPrompt(mockServer as unknown as McpServer);

    const handler = mockServer.getPrompt('product-comparison') as (
      args: { productType: string; priorities?: string }
    ) => { messages: Array<{ role: string; content: { type: string; text: string } }> };

    const result = handler({ productType: 'cards' });

    expect(result.messages[0].content.text).toContain('search-credit-cards');
  });

  it('should generate comparison prompt for seguros', async () => {
    const mockServer = createMockServer();
    const { registerComparisonPrompt } = await import(
      '../../src/prompts/comparison.js'
    );
    registerComparisonPrompt(mockServer as unknown as McpServer);

    const handler = mockServer.getPrompt('product-comparison') as (
      args: { productType: string; priorities?: string }
    ) => { messages: Array<{ role: string; content: { type: string; text: string } }> };

    const result = handler({ productType: 'seguros' });

    expect(result.messages[0].content.text).toContain('search-insurances');
  });

  it('should generate comparison prompt for insurance', async () => {
    const mockServer = createMockServer();
    const { registerComparisonPrompt } = await import(
      '../../src/prompts/comparison.js'
    );
    registerComparisonPrompt(mockServer as unknown as McpServer);

    const handler = mockServer.getPrompt('product-comparison') as (
      args: { productType: string; priorities?: string }
    ) => { messages: Array<{ role: string; content: { type: string; text: string } }> };

    const result = handler({ productType: 'insurance' });

    expect(result.messages[0].content.text).toContain('search-insurances');
  });

  it('should generate comparison prompt with priorities', async () => {
    const mockServer = createMockServer();
    const { registerComparisonPrompt } = await import(
      '../../src/prompts/comparison.js'
    );
    registerComparisonPrompt(mockServer as unknown as McpServer);

    const handler = mockServer.getPrompt('product-comparison') as (
      args: { productType: string; priorities?: string }
    ) => { messages: Array<{ role: string; content: { type: string; text: string } }> };

    const result = handler({ productType: 'préstamos', priorities: 'menor tasa' });

    expect(result.messages[0].content.text).toContain('menor tasa');
  });

  it('should handle unknown product type with default tools', async () => {
    const mockServer = createMockServer();
    const { registerComparisonPrompt } = await import(
      '../../src/prompts/comparison.js'
    );
    registerComparisonPrompt(mockServer as unknown as McpServer);

    const handler = mockServer.getPrompt('product-comparison') as (
      args: { productType: string; priorities?: string }
    ) => { messages: Array<{ role: string; content: { type: string; text: string } }> };

    const result = handler({ productType: 'otros' });

    expect(result.messages[0].content.text).toContain('search-loans');
    expect(result.messages[0].content.text).toContain('search-credit-cards');
    expect(result.messages[0].content.text).toContain('search-insurances');
  });
});

describe('FAQ Prompt', () => {
  it('should generate faq prompt with topic', async () => {
    const mockServer = createMockServer();
    const { registerFaqPrompt } = await import('../../src/prompts/faq.js');
    registerFaqPrompt(mockServer as unknown as McpServer);

    const handler = mockServer.getPrompt('financial-faq') as (
      args: { topic?: string }
    ) => { messages: Array<{ role: string; content: { type: string; text: string } }> };

    const result = handler({ topic: 'préstamos' });

    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].content.text).toContain('préstamos');
  });

  it('should generate faq prompt without topic', async () => {
    const mockServer = createMockServer();
    const { registerFaqPrompt } = await import('../../src/prompts/faq.js');
    registerFaqPrompt(mockServer as unknown as McpServer);

    const handler = mockServer.getPrompt('financial-faq') as (
      args: { topic?: string }
    ) => { messages: Array<{ role: string; content: { type: string; text: string } }> };

    const result = handler({});

    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].content.text).toContain('finanzas personales');
  });
});
