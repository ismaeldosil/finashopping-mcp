/**
 * Financial calculation utilities
 */

/**
 * Calculate monthly payment using French amortization system
 * Formula: Cuota = P * [r(1+r)^n] / [(1+r)^n - 1]
 *
 * @param principal - Loan amount
 * @param annualRate - Annual interest rate (percentage, e.g., 15 for 15%)
 * @param months - Loan term in months
 * @returns Monthly payment amount
 */
export function calculateFrenchPayment(
  principal: number,
  annualRate: number,
  months: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / months;
  return (
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
    (Math.pow(1 + monthlyRate, months) - 1)
  );
}

/**
 * Calculate total loan cost
 */
export function calculateTotalCost(monthlyPayment: number, months: number): number {
  return monthlyPayment * months;
}

/**
 * Calculate total interest paid
 */
export function calculateTotalInterest(
  principal: number,
  monthlyPayment: number,
  months: number
): number {
  return monthlyPayment * months - principal;
}

/**
 * Generate loan payment summary
 */
export function generateLoanSummary(
  principal: number,
  annualRate: number,
  termMonths: number
): {
  principal: number;
  annualRate: number;
  termMonths: number;
  monthlyPayment: number;
  totalAmount: number;
  totalInterest: number;
  currency: string;
} {
  const monthlyPayment = calculateFrenchPayment(principal, annualRate, termMonths);
  const totalAmount = calculateTotalCost(monthlyPayment, termMonths);
  const totalInterest = calculateTotalInterest(principal, monthlyPayment, termMonths);

  return {
    principal,
    annualRate,
    termMonths,
    monthlyPayment: Math.round(monthlyPayment),
    totalAmount: Math.round(totalAmount),
    totalInterest: Math.round(totalInterest),
    currency: '$U',
  };
}
