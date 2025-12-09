import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { fetchLoans } from '../api/client.js';
import type { Loan } from '../api/types.js';

/**
 * Calculate monthly payment using French amortization system
 * Formula: Cuota = P * [r(1+r)^n] / [(1+r)^n - 1]
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
    'Buscar préstamos disponibles en instituciones financieras uruguayas. Permite filtrar por monto, plazo y tipo.',
    {
      amount: z.number().positive().optional().describe('Monto del préstamo en pesos uruguayos'),
      term: z.number().min(6).max(360).optional().describe('Plazo en meses'),
      type: z.enum(['personal', 'auto', 'hipotecario']).optional().describe('Tipo de préstamo')
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
    'Calcular la cuota mensual de un préstamo usando el sistema francés (cuota fija). Devuelve cuota, total a pagar e intereses.',
    {
      amount: z.number().positive().describe('Monto del préstamo'),
      rate: z.number().min(0).max(100).describe('Tasa de interés anual (%)'),
      term: z.number().min(1).max(360).describe('Plazo en meses')
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
    'Comparar múltiples préstamos lado a lado. Útil para elegir la mejor opción.',
    {
      loanIds: z.array(z.number()).min(2).max(5).describe('IDs de préstamos a comparar')
    },
    async ({ loanIds }) => {
      const loans = await getLoans();
      const selectedLoans = loans.filter(loan => loanIds.includes(loan.id));

      if (selectedLoans.length < 2) {
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              error: 'Se necesitan al menos 2 préstamos válidos para comparar',
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
    'Obtener los requisitos para solicitar un préstamo específico.',
    {
      loanId: z.number().describe('ID del préstamo')
    },
    async ({ loanId }) => {
      const loans = await getLoans();
      const loan = loans.find(l => l.id === loanId);

      if (!loan) {
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              error: 'Préstamo no encontrado',
              validIds: loans.map(l => ({ id: l.id, name: l.name }))
            })
          }],
          isError: true
        };
      }

      // Generate requirements based on loan type
      const baseRequirements = [
        'Cédula de identidad uruguaya vigente',
        'Comprobante de domicilio',
        'Último recibo de sueldo'
      ];

      const additionalRequirements: string[] = [];

      if (loan.name.toLowerCase().includes('hipotec')) {
        additionalRequirements.push(
          'Tasación del inmueble',
          'Certificado notarial de la propiedad',
          '3 últimos estados de cuenta bancarios',
          'Antigüedad laboral mínima: 2 años'
        );
      } else if (loan.name.toLowerCase().includes('auto')) {
        additionalRequirements.push(
          'Factura o cotización del vehículo',
          'Seguro obligatorio',
          'Antigüedad laboral mínima: 1 año'
        );
      } else {
        additionalRequirements.push(
          'Clearing bancario limpio',
          'Antigüedad laboral mínima: 6 meses'
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
              income: `Ingreso mínimo recomendado: ${Math.round(loan.monthlyPayment * 3).toLocaleString('es-UY')} $U mensuales`,
              approval: {
                probability: loan.probability,
                estimatedTime: loan.probability === 'alta' ? '24-48 horas' : '3-5 días hábiles'
              }
            },
            features: loan.features
          }, null, 2)
        }]
      };
    }
  );
}
