/**
 * Tests for MCP Resources registration
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
  const resources: Map<string, unknown> = new Map();

  return {
    resource: vi.fn(
      (
        name: string,
        _uri: string,
        _options: unknown,
        handler: unknown
      ) => {
        resources.set(name, handler);
      }
    ),
    getResource: (name: string) => resources.get(name),
    resources,
  };
}

describe('Catalog Resources Registration', () => {
  let mockServer: ReturnType<typeof createMockServer>;

  beforeEach(() => {
    mockServer = createMockServer();
    vi.clearAllMocks();
  });

  it('should register loans resource', async () => {
    const { registerCatalogResources } = await import(
      '../../src/resources/catalogs.js'
    );
    registerCatalogResources(mockServer as unknown as McpServer);

    expect(mockServer.resource).toHaveBeenCalledWith(
      'loans',
      'finashopping://loans',
      expect.any(Object),
      expect.any(Function)
    );
  });

  it('should register cards resource', async () => {
    const { registerCatalogResources } = await import(
      '../../src/resources/catalogs.js'
    );
    registerCatalogResources(mockServer as unknown as McpServer);

    expect(mockServer.resource).toHaveBeenCalledWith(
      'cards',
      'finashopping://cards',
      expect.any(Object),
      expect.any(Function)
    );
  });

  it('should register insurance resource', async () => {
    const { registerCatalogResources } = await import(
      '../../src/resources/catalogs.js'
    );
    registerCatalogResources(mockServer as unknown as McpServer);

    expect(mockServer.resource).toHaveBeenCalledWith(
      'insurance',
      'finashopping://insurance',
      expect.any(Object),
      expect.any(Function)
    );
  });

  it('should register guarantees resource', async () => {
    const { registerCatalogResources } = await import(
      '../../src/resources/catalogs.js'
    );
    registerCatalogResources(mockServer as unknown as McpServer);

    expect(mockServer.resource).toHaveBeenCalledWith(
      'guarantees',
      'finashopping://guarantees',
      expect.any(Object),
      expect.any(Function)
    );
  });

  it('should register benefits resource', async () => {
    const { registerCatalogResources } = await import(
      '../../src/resources/catalogs.js'
    );
    registerCatalogResources(mockServer as unknown as McpServer);

    expect(mockServer.resource).toHaveBeenCalledWith(
      'benefits',
      'finashopping://benefits',
      expect.any(Object),
      expect.any(Function)
    );
  });

  it('should register all 5 catalog resources', async () => {
    const { registerCatalogResources } = await import(
      '../../src/resources/catalogs.js'
    );
    registerCatalogResources(mockServer as unknown as McpServer);

    expect(mockServer.resource).toHaveBeenCalledTimes(5);
  });
});

describe('Institution Resources Registration', () => {
  let mockServer: ReturnType<typeof createMockServer>;

  beforeEach(() => {
    mockServer = createMockServer();
    vi.clearAllMocks();
  });

  it('should register institutions resource', async () => {
    const { registerInstitutionResources } = await import(
      '../../src/resources/institutions.js'
    );
    registerInstitutionResources(mockServer as unknown as McpServer);

    expect(mockServer.resource).toHaveBeenCalledWith(
      'institutions',
      'finashopping://institutions',
      expect.any(Object),
      expect.any(Function)
    );
  });

  it('should register credit-ranges resource', async () => {
    const { registerInstitutionResources } = await import(
      '../../src/resources/institutions.js'
    );
    registerInstitutionResources(mockServer as unknown as McpServer);

    expect(mockServer.resource).toHaveBeenCalledWith(
      'credit-ranges',
      'finashopping://credit/ranges',
      expect.any(Object),
      expect.any(Function)
    );
  });

  it('should register about resource', async () => {
    const { registerInstitutionResources } = await import(
      '../../src/resources/institutions.js'
    );
    registerInstitutionResources(mockServer as unknown as McpServer);

    expect(mockServer.resource).toHaveBeenCalledWith(
      'about',
      'finashopping://about',
      expect.any(Object),
      expect.any(Function)
    );
  });

  it('should register all 3 institution resources', async () => {
    const { registerInstitutionResources } = await import(
      '../../src/resources/institutions.js'
    );
    registerInstitutionResources(mockServer as unknown as McpServer);

    expect(mockServer.resource).toHaveBeenCalledTimes(3);
  });
});

describe('All Resources Registration', () => {
  let mockServer: ReturnType<typeof createMockServer>;

  beforeEach(() => {
    mockServer = createMockServer();
    vi.clearAllMocks();
  });

  it('should register all resources via registerAllResources', async () => {
    const { registerAllResources } = await import(
      '../../src/resources/index.js'
    );
    registerAllResources(mockServer as unknown as McpServer);

    // 5 catalog + 3 institution = 8 resources
    expect(mockServer.resource).toHaveBeenCalledTimes(8);
  });
});

describe('Resource URIs', () => {
  it('should use finashopping:// protocol', async () => {
    const mockServer = createMockServer();
    const { registerCatalogResources } = await import(
      '../../src/resources/catalogs.js'
    );
    registerCatalogResources(mockServer as unknown as McpServer);

    const calls = mockServer.resource.mock.calls;
    calls.forEach((call) => {
      const uri = call[1] as string;
      expect(uri).toMatch(/^finashopping:\/\//);
    });
  });

  it('should have unique URIs', async () => {
    const mockServer = createMockServer();
    const { registerAllResources } = await import(
      '../../src/resources/index.js'
    );
    registerAllResources(mockServer as unknown as McpServer);

    const calls = mockServer.resource.mock.calls;
    const uris = calls.map((call) => call[1] as string);
    const uniqueUris = new Set(uris);

    expect(uniqueUris.size).toBe(uris.length);
  });
});

describe('Resource Metadata', () => {
  it('should have application/json mimeType', async () => {
    const mockServer = createMockServer();
    const { registerCatalogResources } = await import(
      '../../src/resources/catalogs.js'
    );
    registerCatalogResources(mockServer as unknown as McpServer);

    const calls = mockServer.resource.mock.calls;
    calls.forEach((call) => {
      const options = call[2] as { mimeType: string };
      expect(options.mimeType).toBe('application/json');
    });
  });

  it('should have description', async () => {
    const mockServer = createMockServer();
    const { registerCatalogResources } = await import(
      '../../src/resources/catalogs.js'
    );
    registerCatalogResources(mockServer as unknown as McpServer);

    const calls = mockServer.resource.mock.calls;
    calls.forEach((call) => {
      const options = call[2] as { description: string };
      expect(options.description).toBeDefined();
      expect(options.description.length).toBeGreaterThan(0);
    });
  });
});
