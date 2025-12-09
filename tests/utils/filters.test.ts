/**
 * Tests for filter utilities
 */

import { describe, it, expect } from 'vitest';
import {
  filterLoansByAmount,
  filterLoansByType,
  filterLoansByTerm,
  filterCardsByNetwork,
  filterCardsByMaxFee,
  sortCardsByFee,
  filterInsurancesByType,
  filterBenefitsByCategory,
  getUniqueValues,
} from '../../src/utils/filters.js';
import {
  mockLoans,
  mockCreditCards,
  mockInsurances,
  mockBenefits,
} from '../mocks/api.js';

describe('filterLoansByAmount', () => {
  it('should filter loans within ±50% of target amount', () => {
    const filtered = filterLoansByAmount(mockLoans, 150000);
    // Should include loans between 75,000 and 300,000
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach((loan) => {
      expect(loan.amount).toBeGreaterThanOrEqual(75000);
      expect(loan.amount).toBeLessThanOrEqual(300000);
    });
  });

  it('should return empty array if no loans in range', () => {
    const filtered = filterLoansByAmount(mockLoans, 10);
    expect(filtered.length).toBe(0);
  });

  it('should include exact match', () => {
    const filtered = filterLoansByAmount(mockLoans, 150000);
    expect(filtered.some((loan) => loan.amount === 150000)).toBe(true);
  });
});

describe('filterLoansByType', () => {
  it('should filter personal loans', () => {
    const filtered = filterLoansByType(mockLoans, 'personal');
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach((loan) => {
      expect(loan.name.toLowerCase()).toContain('personal');
    });
  });

  it('should filter auto loans', () => {
    const filtered = filterLoansByType(mockLoans, 'auto');
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach((loan) => {
      expect(loan.name.toLowerCase()).toContain('auto');
    });
  });

  it('should filter hipotecario loans', () => {
    const filtered = filterLoansByType(mockLoans, 'hipotecario');
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach((loan) => {
      expect(loan.name.toLowerCase()).toContain('hipotec');
    });
  });
});

describe('filterLoansByTerm', () => {
  it('should filter loans within ±50% of target term', () => {
    const filtered = filterLoansByTerm(mockLoans, 48);
    // Should include loans between 24 and 96 months
    filtered.forEach((loan) => {
      expect(loan.term).toBeGreaterThanOrEqual(24);
      expect(loan.term).toBeLessThanOrEqual(96);
    });
  });

  it('should return empty array if no loans match term', () => {
    const filtered = filterLoansByTerm(mockLoans, 1);
    expect(filtered.length).toBe(0);
  });
});

describe('filterCardsByNetwork', () => {
  it('should filter OCA cards', () => {
    const filtered = filterCardsByNetwork(mockCreditCards, 'OCA');
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach((card) => {
      expect(card.network).toBe('OCA');
    });
  });

  it('should filter Visa cards', () => {
    const filtered = filterCardsByNetwork(mockCreditCards, 'Visa');
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach((card) => {
      expect(card.network).toBe('Visa');
    });
  });

  it('should filter Mastercard cards', () => {
    const filtered = filterCardsByNetwork(mockCreditCards, 'Mastercard');
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach((card) => {
      expect(card.network).toBe('Mastercard');
    });
  });
});

describe('filterCardsByMaxFee', () => {
  it('should filter cards with fee at or below max', () => {
    const filtered = filterCardsByMaxFee(mockCreditCards, 2500);
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach((card) => {
      expect(card.annualFee).toBeLessThanOrEqual(2500);
    });
  });

  it('should include free cards when max is 0', () => {
    const filtered = filterCardsByMaxFee(mockCreditCards, 0);
    filtered.forEach((card) => {
      expect(card.annualFee).toBe(0);
    });
  });

  it('should return all cards when max is very high', () => {
    const filtered = filterCardsByMaxFee(mockCreditCards, 1000000);
    expect(filtered.length).toBe(mockCreditCards.length);
  });
});

describe('sortCardsByFee', () => {
  it('should sort cards by annual fee ascending', () => {
    const sorted = sortCardsByFee(mockCreditCards);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].annualFee).toBeGreaterThanOrEqual(sorted[i - 1].annualFee);
    }
  });

  it('should not mutate original array', () => {
    const original = [...mockCreditCards];
    sortCardsByFee(mockCreditCards);
    expect(mockCreditCards).toEqual(original);
  });

  it('should return same length', () => {
    const sorted = sortCardsByFee(mockCreditCards);
    expect(sorted.length).toBe(mockCreditCards.length);
  });
});

describe('filterInsurancesByType', () => {
  it('should filter by auto type', () => {
    const filtered = filterInsurancesByType(mockInsurances, 'auto');
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach((ins) => {
      expect(ins.type.toLowerCase()).toContain('auto');
    });
  });

  it('should be case insensitive', () => {
    const filtered1 = filterInsurancesByType(mockInsurances, 'AUTO');
    const filtered2 = filterInsurancesByType(mockInsurances, 'auto');
    expect(filtered1.length).toBe(filtered2.length);
  });

  it('should return empty for non-existent type', () => {
    const filtered = filterInsurancesByType(mockInsurances, 'xyz123');
    expect(filtered.length).toBe(0);
  });
});

describe('filterBenefitsByCategory', () => {
  it('should filter by category', () => {
    const filtered = filterBenefitsByCategory(mockBenefits, 'Alimentación');
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach((benefit) => {
      expect(benefit.category.toLowerCase()).toContain('alimentación');
    });
  });

  it('should be case insensitive', () => {
    const filtered1 = filterBenefitsByCategory(mockBenefits, 'ENTRETENIMIENTO');
    const filtered2 = filterBenefitsByCategory(mockBenefits, 'entretenimiento');
    expect(filtered1.length).toBe(filtered2.length);
  });
});

describe('getUniqueValues', () => {
  it('should get unique categories from benefits', () => {
    const categories = getUniqueValues(mockBenefits, 'category');
    expect(categories.length).toBeLessThanOrEqual(mockBenefits.length);
    expect(new Set(categories).size).toBe(categories.length);
  });

  it('should get unique networks from cards', () => {
    const networks = getUniqueValues(mockCreditCards, 'network');
    expect(networks.length).toBeLessThanOrEqual(mockCreditCards.length);
  });

  it('should get unique insurance types', () => {
    const types = getUniqueValues(mockInsurances, 'type');
    expect(types.length).toBeLessThanOrEqual(mockInsurances.length);
  });
});
