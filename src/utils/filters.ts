/**
 * Filtering utilities for financial products
 */

import type { Loan, CreditCard, Insurance, Benefit } from '../api/types.js';

/**
 * Filter loans by amount range (±50% of target)
 */
export function filterLoansByAmount(loans: Loan[], targetAmount: number): Loan[] {
  const minAmount = targetAmount * 0.5;
  const maxAmount = targetAmount * 2;
  return loans.filter((loan) => loan.amount >= minAmount && loan.amount <= maxAmount);
}

/**
 * Filter loans by type (personal, auto, hipotecario)
 */
export function filterLoansByType(
  loans: Loan[],
  type: 'personal' | 'auto' | 'hipotecario'
): Loan[] {
  return loans.filter((loan) => {
    const name = loan.name.toLowerCase();
    if (type === 'personal') return name.includes('personal');
    if (type === 'auto') return name.includes('auto');
    if (type === 'hipotecario') return name.includes('hipotec');
    return true;
  });
}

/**
 * Filter loans by term range (±50% of target)
 */
export function filterLoansByTerm(loans: Loan[], targetTerm: number): Loan[] {
  return loans.filter(
    (loan) => loan.term >= targetTerm * 0.5 && loan.term <= targetTerm * 2
  );
}

/**
 * Filter credit cards by network
 */
export function filterCardsByNetwork(
  cards: CreditCard[],
  network: 'OCA' | 'Visa' | 'Mastercard'
): CreditCard[] {
  return cards.filter((card) => card.network === network);
}

/**
 * Filter credit cards by max annual fee
 */
export function filterCardsByMaxFee(cards: CreditCard[], maxFee: number): CreditCard[] {
  return cards.filter((card) => card.annualFee <= maxFee);
}

/**
 * Sort credit cards by annual fee (ascending)
 */
export function sortCardsByFee(cards: CreditCard[]): CreditCard[] {
  return [...cards].sort((a, b) => a.annualFee - b.annualFee);
}

/**
 * Filter insurances by type
 */
export function filterInsurancesByType(insurances: Insurance[], type: string): Insurance[] {
  const searchType = type.toLowerCase();
  return insurances.filter((ins) => ins.type.toLowerCase().includes(searchType));
}

/**
 * Filter benefits by category
 */
export function filterBenefitsByCategory(benefits: Benefit[], category: string): Benefit[] {
  return benefits.filter((b) =>
    b.category.toLowerCase().includes(category.toLowerCase())
  );
}

/**
 * Get unique values from array
 */
export function getUniqueValues<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return [...new Set(items.map((item) => item[key]))];
}
