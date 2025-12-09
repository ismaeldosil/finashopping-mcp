/**
 * Tests for requirements utilities
 */

import { describe, it, expect } from 'vitest';
import {
  BASE_LOAN_REQUIREMENTS,
  MORTGAGE_REQUIREMENTS,
  AUTO_REQUIREMENTS,
  PERSONAL_REQUIREMENTS,
  BASE_CARD_REQUIREMENTS,
  getLoanType,
  getAdditionalRequirements,
  generateLoanRequirements,
  generateCardRequirements,
} from '../../src/utils/requirements.js';
import { mockLoans, mockCreditCards } from '../mocks/api.js';

describe('Constants', () => {
  it('should have base loan requirements', () => {
    expect(BASE_LOAN_REQUIREMENTS).toContain('Cédula de identidad uruguaya vigente');
    expect(BASE_LOAN_REQUIREMENTS).toContain('Comprobante de domicilio');
    expect(BASE_LOAN_REQUIREMENTS).toContain('Último recibo de sueldo');
    expect(BASE_LOAN_REQUIREMENTS.length).toBe(3);
  });

  it('should have mortgage requirements', () => {
    expect(MORTGAGE_REQUIREMENTS).toContain('Tasación del inmueble');
    expect(MORTGAGE_REQUIREMENTS.length).toBe(4);
  });

  it('should have auto requirements', () => {
    expect(AUTO_REQUIREMENTS).toContain('Factura o cotización del vehículo');
    expect(AUTO_REQUIREMENTS.length).toBe(3);
  });

  it('should have personal requirements', () => {
    expect(PERSONAL_REQUIREMENTS).toContain('Clearing bancario limpio');
    expect(PERSONAL_REQUIREMENTS.length).toBe(2);
  });

  it('should have base card requirements', () => {
    expect(BASE_CARD_REQUIREMENTS).toContain('Cédula de identidad uruguaya');
    expect(BASE_CARD_REQUIREMENTS.length).toBe(3);
  });
});

describe('getLoanType', () => {
  it('should detect hipotecario loans', () => {
    expect(getLoanType('Préstamo Hipotecario')).toBe('hipotecario');
    expect(getLoanType('HIPOTECARIO')).toBe('hipotecario');
    expect(getLoanType('préstamo hipotec')).toBe('hipotecario');
  });

  it('should detect auto loans', () => {
    expect(getLoanType('Préstamo Auto')).toBe('auto');
    expect(getLoanType('AUTO LOAN')).toBe('auto');
    expect(getLoanType('Crédito automotor')).toBe('auto');
  });

  it('should default to personal for other loans', () => {
    expect(getLoanType('Préstamo Personal')).toBe('personal');
    expect(getLoanType('Crédito de consumo')).toBe('personal');
    expect(getLoanType('Cualquier otro')).toBe('personal');
  });
});

describe('getAdditionalRequirements', () => {
  it('should return mortgage requirements for hipotecario', () => {
    const reqs = getAdditionalRequirements('hipotecario');
    expect(reqs).toEqual(MORTGAGE_REQUIREMENTS);
  });

  it('should return auto requirements for auto', () => {
    const reqs = getAdditionalRequirements('auto');
    expect(reqs).toEqual(AUTO_REQUIREMENTS);
  });

  it('should return personal requirements for personal', () => {
    const reqs = getAdditionalRequirements('personal');
    expect(reqs).toEqual(PERSONAL_REQUIREMENTS);
  });
});

describe('generateLoanRequirements', () => {
  it('should generate requirements for personal loan', () => {
    const personalLoan = mockLoans.find((l) => l.name.includes('Personal'))!;
    const reqs = generateLoanRequirements(personalLoan);

    expect(reqs).toHaveProperty('documentation');
    expect(reqs).toHaveProperty('income');
    expect(reqs).toHaveProperty('approval');

    expect(reqs.documentation).toEqual(
      expect.arrayContaining(BASE_LOAN_REQUIREMENTS)
    );
    expect(reqs.documentation).toEqual(
      expect.arrayContaining(PERSONAL_REQUIREMENTS)
    );
  });

  it('should generate requirements for auto loan', () => {
    const autoLoan = mockLoans.find((l) => l.name.includes('Auto'))!;
    const reqs = generateLoanRequirements(autoLoan);

    expect(reqs.documentation).toEqual(
      expect.arrayContaining(AUTO_REQUIREMENTS)
    );
  });

  it('should generate requirements for hipotecario loan', () => {
    const mortgageLoan = mockLoans.find((l) => l.name.includes('Hipotecario'))!;
    const reqs = generateLoanRequirements(mortgageLoan);

    expect(reqs.documentation).toEqual(
      expect.arrayContaining(MORTGAGE_REQUIREMENTS)
    );
  });

  it('should calculate income requirement correctly', () => {
    const loan = mockLoans[0];
    const reqs = generateLoanRequirements(loan);

    // Income should be 3x monthly payment
    expect(reqs.income).toContain('$U mensuales');
    expect(reqs.income).toContain('Ingreso mínimo recomendado');
  });

  it('should set approval time based on probability', () => {
    const highProbLoan = mockLoans.find((l) => l.probability === 'alta')!;
    const lowProbLoan = mockLoans.find((l) => l.probability === 'baja')!;

    const highReqs = generateLoanRequirements(highProbLoan);
    const lowReqs = generateLoanRequirements(lowProbLoan);

    expect(highReqs.approval.estimatedTime).toBe('24-48 horas');
    expect(lowReqs.approval.estimatedTime).toBe('3-5 días hábiles');
  });

  it('should include probability in approval', () => {
    const loan = mockLoans[0];
    const reqs = generateLoanRequirements(loan);

    expect(reqs.approval.probability).toBe(loan.probability);
  });
});

describe('generateCardRequirements', () => {
  it('should include base requirements', () => {
    const card = mockCreditCards[0];
    const reqs = generateCardRequirements(card);

    expect(reqs).toEqual(expect.arrayContaining(BASE_CARD_REQUIREMENTS));
  });

  it('should add premium requirements for USD cards', () => {
    const usdCard = mockCreditCards.find((c) => c.currency === 'USD')!;
    const reqs = generateCardRequirements(usdCard);

    expect(reqs).toContain('Ingresos mínimos: $U 60.000 mensuales');
    expect(reqs).toContain('Antigüedad laboral: 1 año');
  });

  it('should add premium requirements for high limit cards', () => {
    const highLimitCard = mockCreditCards.find((c) => c.limit > 300000)!;
    const reqs = generateCardRequirements(highLimitCard);

    expect(reqs).toContain('Ingresos mínimos: $U 60.000 mensuales');
  });

  it('should add standard requirements for regular cards', () => {
    const regularCard = mockCreditCards.find(
      (c) => c.currency !== 'USD' && c.limit <= 300000
    )!;
    const reqs = generateCardRequirements(regularCard);

    expect(reqs).toContain('Ingresos mínimos: $U 25.000 mensuales');
    expect(reqs).toContain('Antigüedad laboral: 6 meses');
  });
});
