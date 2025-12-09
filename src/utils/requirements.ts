/**
 * Utilities for generating loan requirements
 */

import type { Loan, CreditCard } from '../api/types.js';

/**
 * Base requirements for all loans
 */
export const BASE_LOAN_REQUIREMENTS = [
  'Cédula de identidad uruguaya vigente',
  'Comprobante de domicilio',
  'Último recibo de sueldo',
];

/**
 * Additional requirements for mortgage loans
 */
export const MORTGAGE_REQUIREMENTS = [
  'Tasación del inmueble',
  'Certificado notarial de la propiedad',
  '3 últimos estados de cuenta bancarios',
  'Antigüedad laboral mínima: 2 años',
];

/**
 * Additional requirements for auto loans
 */
export const AUTO_REQUIREMENTS = [
  'Factura o cotización del vehículo',
  'Seguro obligatorio',
  'Antigüedad laboral mínima: 1 año',
];

/**
 * Additional requirements for personal loans
 */
export const PERSONAL_REQUIREMENTS = [
  'Clearing bancario limpio',
  'Antigüedad laboral mínima: 6 meses',
];

/**
 * Determine loan type from name
 */
export function getLoanType(loanName: string): 'hipotecario' | 'auto' | 'personal' {
  const name = loanName.toLowerCase();
  if (name.includes('hipotec')) return 'hipotecario';
  if (name.includes('auto')) return 'auto';
  return 'personal';
}

/**
 * Get additional requirements based on loan type
 */
export function getAdditionalRequirements(loanType: 'hipotecario' | 'auto' | 'personal'): string[] {
  switch (loanType) {
    case 'hipotecario':
      return MORTGAGE_REQUIREMENTS;
    case 'auto':
      return AUTO_REQUIREMENTS;
    default:
      return PERSONAL_REQUIREMENTS;
  }
}

/**
 * Generate complete requirements for a loan
 */
export function generateLoanRequirements(loan: Loan): {
  documentation: string[];
  income: string;
  approval: {
    probability: string;
    estimatedTime: string;
  };
} {
  const loanType = getLoanType(loan.name);
  const additionalRequirements = getAdditionalRequirements(loanType);

  return {
    documentation: [...BASE_LOAN_REQUIREMENTS, ...additionalRequirements],
    income: `Ingreso mínimo recomendado: ${Math.round(loan.monthlyPayment * 3).toLocaleString('es-UY')} $U mensuales`,
    approval: {
      probability: loan.probability,
      estimatedTime: loan.probability === 'alta' ? '24-48 horas' : '3-5 días hábiles',
    },
  };
}

/**
 * Base requirements for credit cards
 */
export const BASE_CARD_REQUIREMENTS = [
  'Cédula de identidad uruguaya',
  'Comprobante de ingresos',
  'Comprobante de domicilio',
];

/**
 * Generate requirements for a credit card
 */
export function generateCardRequirements(card: CreditCard): string[] {
  const requirements = [...BASE_CARD_REQUIREMENTS];

  if (card.currency === 'USD' || card.limit > 300000) {
    requirements.push(
      'Ingresos mínimos: $U 60.000 mensuales',
      'Antigüedad laboral: 1 año'
    );
  } else {
    requirements.push(
      'Ingresos mínimos: $U 25.000 mensuales',
      'Antigüedad laboral: 6 meses'
    );
  }

  return requirements;
}
