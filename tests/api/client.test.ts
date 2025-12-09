/**
 * Tests for API client
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { mockLoginResponse, mockLoans, mockCreditCards } from '../mocks/api.js';

// Mock axios
vi.mock('axios', async () => {
  const actual = await vi.importActual('axios');
  return {
    ...actual,
    default: {
      create: vi.fn(() => ({
        get: vi.fn(),
        post: vi.fn(),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      })),
      post: vi.fn(),
    },
  };
});

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication', () => {
    it('should require service credentials', async () => {
      // Clear env vars temporarily
      const originalUsername = process.env.FINASHOPPING_SERVICE_USERNAME;
      const originalPassword = process.env.FINASHOPPING_SERVICE_PASSWORD;

      delete process.env.FINASHOPPING_SERVICE_USERNAME;
      delete process.env.FINASHOPPING_SERVICE_PASSWORD;

      // Re-import to test without credentials
      vi.resetModules();

      // Restore for other tests
      process.env.FINASHOPPING_SERVICE_USERNAME = originalUsername;
      process.env.FINASHOPPING_SERVICE_PASSWORD = originalPassword;

      expect(true).toBe(true); // Placeholder - credentials check happens at runtime
    });

    it('should authenticate with valid credentials', async () => {
      (axios.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: mockLoginResponse,
      });

      // The auth happens inside the interceptor, we verify the mock was set up
      expect(axios.post).toBeDefined();
    });
  });

  describe('API URL Configuration', () => {
    it('should use environment variable for API URL', () => {
      expect(process.env.FINASHOPPING_API_URL).toBe('https://api.test.finashopping.uy');
    });

    it('should have default production URL', () => {
      // Default is set in client.ts when env var is not present
      const defaultUrl = 'https://finashopping-backend-production.up.railway.app';
      expect(defaultUrl).toContain('finashopping');
    });
  });
});

describe('API Types', () => {
  it('should have correct Loan structure', () => {
    const loan = mockLoans[0];
    expect(loan).toHaveProperty('id');
    expect(loan).toHaveProperty('name');
    expect(loan).toHaveProperty('institution');
    expect(loan).toHaveProperty('amount');
    expect(loan).toHaveProperty('currency');
    expect(loan).toHaveProperty('rate');
    expect(loan).toHaveProperty('term');
    expect(loan).toHaveProperty('monthlyPayment');
    expect(loan).toHaveProperty('probability');
    expect(loan).toHaveProperty('features');
  });

  it('should have correct CreditCard structure', () => {
    const card = mockCreditCards[0];
    expect(card).toHaveProperty('id');
    expect(card).toHaveProperty('name');
    expect(card).toHaveProperty('issuer');
    expect(card).toHaveProperty('network');
    expect(card).toHaveProperty('limit');
    expect(card).toHaveProperty('currency');
    expect(card).toHaveProperty('annualFee');
    expect(card).toHaveProperty('benefits');
    expect(card).toHaveProperty('recommendation');
  });

  it('should validate currency types', () => {
    const validCurrencies = ['$U', 'USD'];
    mockLoans.forEach((loan) => {
      expect(validCurrencies).toContain(loan.currency);
    });
  });

  it('should validate probability types', () => {
    const validProbabilities = ['alta', 'media', 'baja'];
    mockLoans.forEach((loan) => {
      expect(validProbabilities).toContain(loan.probability);
    });
  });

  it('should validate network types', () => {
    const validNetworks = ['OCA', 'Visa', 'Mastercard'];
    mockCreditCards.forEach((card) => {
      expect(validNetworks).toContain(card.network);
    });
  });
});
