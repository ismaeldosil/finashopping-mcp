/**
 * Mock data for API responses
 */

import type {
  Loan,
  CreditCard,
  Insurance,
  Guarantee,
  Benefit,
} from '../../src/api/types.js';

export const mockLoans: Loan[] = [
  {
    id: 1,
    name: 'Préstamo Personal BROU',
    institution: 'BROU',
    amount: 150000,
    currency: '$U',
    rate: 28,
    term: 36,
    monthlyPayment: 5850,
    probability: 'alta',
    features: ['Sin comisiones', 'Tasa fija'],
  },
  {
    id: 2,
    name: 'Préstamo Auto Santander',
    institution: 'Santander',
    amount: 800000,
    currency: '$U',
    rate: 32,
    term: 60,
    monthlyPayment: 22400,
    probability: 'media',
    features: ['Seguro incluido'],
  },
  {
    id: 3,
    name: 'Préstamo Hipotecario Itaú',
    institution: 'Itaú',
    amount: 3000000,
    currency: 'USD',
    rate: 8.5,
    term: 240,
    monthlyPayment: 25650,
    probability: 'baja',
    features: ['Hasta 80% financiación'],
  },
];

export const mockCreditCards: CreditCard[] = [
  {
    id: 1,
    name: 'OCA Blue',
    issuer: 'OCA',
    network: 'OCA',
    limit: 100000,
    currency: '$U',
    annualFee: 0,
    benefits: ['Sin costo anual'],
    recommendation: 'Ideal para comenzar',
  },
  {
    id: 2,
    name: 'Visa Gold Santander',
    issuer: 'Santander',
    network: 'Visa',
    limit: 300000,
    currency: '$U',
    annualFee: 2500,
    benefits: ['Millas', 'Seguro viaje'],
    recommendation: 'Para viajeros frecuentes',
  },
  {
    id: 3,
    name: 'Mastercard Black',
    issuer: 'Itaú',
    network: 'Mastercard',
    limit: 500000,
    currency: 'USD',
    annualFee: 150,
    benefits: ['Concierge', 'Priority Pass'],
    recommendation: 'Premium',
  },
];

export const mockInsurances: Insurance[] = [
  {
    id: 1,
    type: 'Auto',
    provider: 'BSE',
    coverage: 'Todo riesgo',
    monthlyPremium: 2500,
    features: ['Grúa 24/7', 'Auto sustituto'],
  },
  {
    id: 2,
    type: 'Hogar',
    provider: 'Mapfre',
    coverage: 'Incendio y robo',
    monthlyPremium: 1200,
    features: ['Cobertura contenido'],
  },
  {
    id: 3,
    type: 'Vida',
    provider: 'Sura',
    coverage: 'Fallecimiento',
    monthlyPremium: 800,
    features: ['Doble indemnización'],
  },
];

export const mockGuarantees: Guarantee[] = [
  {
    id: 1,
    type: 'Alquiler',
    provider: 'Porto Seguro',
    coverage: '24 meses',
    requirements: ['Recibo de sueldo', 'Cédula'],
    monthlyFee: 1500,
    description: 'Garantía de alquiler sin depósito',
  },
  {
    id: 2,
    type: 'Alquiler',
    provider: 'ANDA',
    coverage: '12 meses',
    requirements: ['Clearing limpio'],
    monthlyFee: 1200,
    description: 'Garantía rápida',
  },
];

export const mockBenefits: Benefit[] = [
  {
    id: 1,
    title: '20% en Supermercados',
    description: 'Descuento en compras',
    discount: '20%',
    category: 'Alimentación',
    validUntil: '2025-12-31',
  },
  {
    id: 2,
    title: '2x1 en Cines',
    description: 'Entradas de cine',
    discount: '50%',
    category: 'Entretenimiento',
    validUntil: '2025-12-31',
  },
];

export const mockLoginResponse = {
  success: true,
  token: 'mock-jwt-token',
  refreshToken: 'mock-refresh-token',
  user: {
    id: 'user-123',
    username: 'test-user',
    name: 'Test User',
    email: 'test@finashopping.uy',
  },
};
