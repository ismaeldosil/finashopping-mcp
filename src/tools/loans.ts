import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { fetchLoans } from '../api/client.js';
import type { Loan } from '../api/types.js';

/**
 * Calculate monthly payment using French amortization system
 * Formula: Payment = P * [r(1+r)^n] / [(1+r)^n - 1]
 */
function calculateFrenchPayment(principal: number, annualRate: number, months: number): number {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / months;
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) /
         (Math.pow(1 + monthlyRate, months) - 1);
}

/**
 * Fetch loans from API
 */
async function getLoans(): Promise<Loan[]> {
  const response = await fetchLoans();
  return response.loans;
}

export function registerLoanTools(server: McpServer): void {
  // Tool: search-loans
  server.tool(
    'search-loans',
    'Search available loans from Uruguayan financial institutions. Filter by amount, term, and type. | Buscar préstamos disponibles en instituciones financieras uruguayas. Filtrar por monto, plazo y tipo.',
    {
      amount: z.number().positive().optional().describe('Loan amount in Uruguayan pesos | Monto del préstamo en pesos uruguayos'),
      term: z.number().min(6).max(360).optional().describe('Term in months | Plazo en meses'),
      type: z.enum(['personal', 'auto', 'hipotecario']).optional().describe('Loan type | Tipo de préstamo')
    },
    async ({ amount, term, type }) => {
      const loans = await getLoans();
      let filteredLoans = [...loans];

      // Filter by amount (±50% range)
      if (amount) {
        const minAmount = amount * 0.5;
        const maxAmount = amount * 2;
        filteredLoans = filteredLoans.filter(
          loan => loan.amount >= minAmount && loan.amount <= maxAmount
        );
      }

      // Filter by type
      if (type) {
        const loanName = type.toLowerCase();
        filteredLoans = filteredLoans.filter(loan => {
          const name = loan.name.toLowerCase();
          if (loanName === 'personal') return name.includes('personal');
          if (loanName === 'auto') return name.includes('auto');
          if (loanName === 'hipotecario') return name.includes('hipotec');
          return true;
        });
      }

      // Filter by term
      if (term) {
        filteredLoans = filteredLoans.filter(
          loan => loan.term >= term * 0.5 && loan.term <= term * 2
        );
      }

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            loans: filteredLoans,
            count: filteredLoans.length,
            filters: { amount, term, type }
          }, null, 2)
        }]
      };
    }
  );

  // Tool: calculate-loan-payment
  server.tool(
    'calculate-loan-payment',
    'Calculate monthly loan payment using the French amortization system (fixed payment). Returns payment, total amount, and interest. | Calcular la cuota mensual de un préstamo usando el sistema francés (cuota fija). Devuelve cuota, total a pagar e intereses.',
    {
      amount: z.number().positive().describe('Loan amount | Monto del préstamo'),
      rate: z.number().min(0).max(100).describe('Annual interest rate (%) | Tasa de interés anual (%)'),
      term: z.number().min(1).max(360).describe('Term in months | Plazo en meses')
    },
    async ({ amount, rate, term }) => {
      const monthlyPayment = calculateFrenchPayment(amount, rate, term);
      const totalAmount = monthlyPayment * term;
      const totalInterest = totalAmount - amount;

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            principal: amount,
            annualRate: rate,
            termMonths: term,
            monthlyPayment: Math.round(monthlyPayment),
            totalAmount: Math.round(totalAmount),
            totalInterest: Math.round(totalInterest),
            currency: '$U'
          }, null, 2)
        }]
      };
    }
  );

  // Tool: compare-loans
  server.tool(
    'compare-loans',
    'Compare multiple loans side by side. Useful for choosing the best option. | Comparar múltiples préstamos lado a lado. Útil para elegir la mejor opción.',
    {
      loanIds: z.array(z.number()).min(2).max(5).describe('Loan IDs to compare | IDs de préstamos a comparar')
    },
    async ({ loanIds }) => {
      const loans = await getLoans();
      const selectedLoans = loans.filter(loan => loanIds.includes(loan.id));

      if (selectedLoans.length < 2) {
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              error: 'At least 2 valid loans are required for comparison | Se necesitan al menos 2 préstamos válidos para comparar',
              validIds: loans.map(l => l.id)
            })
          }],
          isError: true
        };
      }

      const comparison = selectedLoans.map(loan => ({
        id: loan.id,
        name: loan.name,
        institution: loan.institution,
        amount: loan.amount,
        currency: loan.currency,
        rate: loan.rate,
        term: loan.term,
        monthlyPayment: loan.monthlyPayment,
        totalCost: loan.monthlyPayment * loan.term,
        probability: loan.probability
      }));

      // Find best options
      const lowestRate = comparison.reduce((min, l) => l.rate < min.rate ? l : min);
      const lowestPayment = comparison.reduce((min, l) => l.monthlyPayment < min.monthlyPayment ? l : min);
      const highestProbability = comparison.find(l => l.probability === 'alta') || comparison[0];

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            comparison,
            recommendations: {
              lowestRate: { id: lowestRate.id, name: lowestRate.name, rate: lowestRate.rate },
              lowestPayment: { id: lowestPayment.id, name: lowestPayment.name, payment: lowestPayment.monthlyPayment },
              highestApproval: { id: highestProbability.id, name: highestProbability.name, probability: highestProbability.probability }
            }
          }, null, 2)
        }]
      };
    }
  );

  // Tool: get-loan-requirements
  server.tool(
    'get-loan-requirements',
    'Get the requirements to apply for a specific loan. | Obtener los requisitos para solicitar un préstamo específico.',
    {
      loanId: z.number().describe('Loan ID | ID del préstamo')
    },
    async ({ loanId }) => {
      const loans = await getLoans();
      const loan = loans.find(l => l.id === loanId);

      if (!loan) {
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              error: 'Loan not found | Préstamo no encontrado',
              validIds: loans.map(l => ({ id: l.id, name: l.name }))
            })
          }],
          isError: true
        };
      }

      // Generate requirements based on loan type (bilingual)
      const baseRequirements = [
        'Valid Uruguayan ID card | Cédula de identidad uruguaya vigente',
        'Proof of address | Comprobante de domicilio',
        'Latest pay stub | Último recibo de sueldo'
      ];

      const additionalRequirements: string[] = [];

      if (loan.name.toLowerCase().includes('hipotec')) {
        additionalRequirements.push(
          'Property appraisal | Tasación del inmueble',
          'Notarized property certificate | Certificado notarial de la propiedad',
          'Last 3 bank statements | 3 últimos estados de cuenta bancarios',
          'Minimum employment history: 2 years | Antigüedad laboral mínima: 2 años'
        );
      } else if (loan.name.toLowerCase().includes('auto')) {
        additionalRequirements.push(
          'Vehicle invoice or quote | Factura o cotización del vehículo',
          'Mandatory insurance | Seguro obligatorio',
          'Minimum employment history: 1 year | Antigüedad laboral mínima: 1 año'
        );
      } else {
        additionalRequirements.push(
          'Clean credit history | Clearing bancario limpio',
          'Minimum employment history: 6 months | Antigüedad laboral mínima: 6 meses'
        );
      }

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            loan: {
              id: loan.id,
              name: loan.name,
              institution: loan.institution
            },
            requirements: {
              documentation: [...baseRequirements, ...additionalRequirements],
              income: `Recommended minimum income | Ingreso mínimo recomendado: ${Math.round(loan.monthlyPayment * 3).toLocaleString('es-UY')} $U monthly | mensuales`,
              approval: {
                probability: loan.probability,
                estimatedTime: loan.probability === 'alta' ? '24-48 hours | horas' : '3-5 business days | días hábiles'
              }
            },
            features: loan.features
          }, null, 2)
        }]
      };
    }
  );
}
