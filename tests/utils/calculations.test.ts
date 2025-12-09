/**
 * Tests for calculation utilities
 */

import { describe, it, expect } from 'vitest';
import {
  calculateFrenchPayment,
  calculateTotalCost,
  calculateTotalInterest,
  generateLoanSummary,
} from '../../src/utils/calculations.js';

describe('calculateFrenchPayment', () => {
  it('should calculate monthly payment correctly for standard loan', () => {
    // $500,000 at 15% annual rate for 60 months
    const payment = calculateFrenchPayment(500000, 15, 60);
    // Expected ~11,895
    expect(Math.round(payment)).toBe(11895);
  });

  it('should calculate monthly payment for high interest rate', () => {
    // $100,000 at 30% annual rate for 24 months
    const payment = calculateFrenchPayment(100000, 30, 24);
    expect(Math.round(payment)).toBe(5591);
  });

  it('should handle zero interest rate', () => {
    // $120,000 at 0% for 12 months = 10,000/month
    const payment = calculateFrenchPayment(120000, 0, 12);
    expect(payment).toBe(10000);
  });

  it('should calculate for short term loans', () => {
    // $50,000 at 20% for 6 months
    const payment = calculateFrenchPayment(50000, 20, 6);
    expect(Math.round(payment)).toBe(8826);
  });

  it('should calculate for long term loans (mortgage)', () => {
    // $1,000,000 at 8% for 240 months (20 years)
    const payment = calculateFrenchPayment(1000000, 8, 240);
    expect(Math.round(payment)).toBe(8364);
  });

  it('should return positive values for valid inputs', () => {
    const payment = calculateFrenchPayment(100000, 10, 12);
    expect(payment).toBeGreaterThan(0);
  });
});

describe('calculateTotalCost', () => {
  it('should calculate total loan cost correctly', () => {
    const total = calculateTotalCost(10000, 12);
    expect(total).toBe(120000);
  });

  it('should handle large payments', () => {
    const total = calculateTotalCost(50000, 240);
    expect(total).toBe(12000000);
  });

  it('should handle single payment', () => {
    const total = calculateTotalCost(100000, 1);
    expect(total).toBe(100000);
  });
});

describe('calculateTotalInterest', () => {
  it('should calculate total interest correctly', () => {
    // Principal: 100,000, Monthly: 10,000, 12 months
    // Total: 120,000, Interest: 20,000
    const interest = calculateTotalInterest(100000, 10000, 12);
    expect(interest).toBe(20000);
  });

  it('should return zero for zero interest loan', () => {
    // Principal: 120,000, Monthly: 10,000, 12 months = no interest
    const interest = calculateTotalInterest(120000, 10000, 12);
    expect(interest).toBe(0);
  });

  it('should handle negative principal difference', () => {
    // This shouldn't happen in practice, but tests edge case
    const interest = calculateTotalInterest(50000, 1000, 12);
    expect(interest).toBe(-38000);
  });
});

describe('generateLoanSummary', () => {
  it('should generate complete loan summary', () => {
    const summary = generateLoanSummary(500000, 15, 60);

    expect(summary).toHaveProperty('principal', 500000);
    expect(summary).toHaveProperty('annualRate', 15);
    expect(summary).toHaveProperty('termMonths', 60);
    expect(summary).toHaveProperty('monthlyPayment');
    expect(summary).toHaveProperty('totalAmount');
    expect(summary).toHaveProperty('totalInterest');
    expect(summary).toHaveProperty('currency', '$U');
  });

  it('should round payment values', () => {
    const summary = generateLoanSummary(100000, 12, 24);

    expect(Number.isInteger(summary.monthlyPayment)).toBe(true);
    expect(Number.isInteger(summary.totalAmount)).toBe(true);
    expect(Number.isInteger(summary.totalInterest)).toBe(true);
  });

  it('should calculate consistent values', () => {
    const summary = generateLoanSummary(200000, 20, 36);

    // totalAmount should be close to monthlyPayment * termMonths (within rounding tolerance)
    const expectedTotal = summary.monthlyPayment * summary.termMonths;
    expect(Math.abs(summary.totalAmount - expectedTotal)).toBeLessThanOrEqual(36); // 1 per month rounding tolerance

    // totalInterest should equal totalAmount - principal
    expect(summary.totalInterest).toBe(summary.totalAmount - summary.principal);
  });

  it('should handle edge case of 1 month term', () => {
    const summary = generateLoanSummary(100000, 12, 1);

    expect(summary.monthlyPayment).toBeGreaterThan(100000);
    expect(summary.totalInterest).toBeGreaterThan(0);
  });
});
