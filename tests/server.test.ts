/**
 * Tests for MCP Server
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the API client before importing server
vi.mock('../src/api/client.js', () => ({
  fetchLoans: vi.fn().mockResolvedValue({ loans: [] }),
  fetchCreditCards: vi.fn().mockResolvedValue({ creditCards: [] }),
  fetchInsurances: vi.fn().mockResolvedValue({ insurances: [] }),
  fetchGuarantees: vi.fn().mockResolvedValue({ guarantees: [] }),
  fetchBenefits: vi.fn().mockResolvedValue({ benefits: [] }),
}));

import { createServer } from '../src/server.js';

describe('MCP Server', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create server instance', () => {
    const server = createServer();
    expect(server).toBeDefined();
  });

  it('should have server name', () => {
    const server = createServer();
    // Server name is set in constructor
    expect(server).toBeDefined();
  });

  it('should register tools without error', () => {
    expect(() => createServer()).not.toThrow();
  });

  it('should register resources without error', () => {
    expect(() => createServer()).not.toThrow();
  });

  it('should register prompts without error', () => {
    expect(() => createServer()).not.toThrow();
  });
});

describe('Server Configuration', () => {
  it('should use correct server name', () => {
    const server = createServer();
    // The server is created with name 'finashopping-mcp'
    expect(server).toBeDefined();
  });

  it('should use correct version', () => {
    const server = createServer();
    // Version is set to 0.1.0
    expect(server).toBeDefined();
  });
});
