import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { creditCards } from '../data/test-data.js';

export function registerCardTools(server: McpServer): void {
  // Tool: search-credit-cards
  server.tool(
    'search-credit-cards',
    'Buscar tarjetas de crédito disponibles en Uruguay. Permite filtrar por red de pago y costo anual máximo.',
    {
      network: z.enum(['OCA', 'Visa', 'Mastercard']).optional().describe('Red de pago'),
      maxAnnualFee: z.number().min(0).optional().describe('Costo anual máximo en pesos uruguayos')
    },
    async ({ network, maxAnnualFee }) => {
      let filteredCards = [...creditCards];

      // Filter by network
      if (network) {
        filteredCards = filteredCards.filter(card => card.network === network);
      }

      // Filter by max annual fee
      if (maxAnnualFee !== undefined) {
        filteredCards = filteredCards.filter(card => card.annualFee <= maxAnnualFee);
      }

      // Sort by annual fee (lowest first)
      filteredCards.sort((a, b) => a.annualFee - b.annualFee);

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            creditCards: filteredCards,
            count: filteredCards.length,
            filters: { network, maxAnnualFee },
            tip: maxAnnualFee === 0 || (maxAnnualFee !== undefined && maxAnnualFee === 0)
              ? 'Encontraste tarjetas sin costo anual!'
              : 'Tip: Usa maxAnnualFee: 0 para ver solo tarjetas gratis'
          }, null, 2)
        }]
      };
    }
  );

  // Tool: get-card-details
  server.tool(
    'get-card-details',
    'Obtener detalles completos de una tarjeta de crédito específica.',
    {
      cardId: z.number().describe('ID de la tarjeta')
    },
    async ({ cardId }) => {
      const card = creditCards.find(c => c.id === cardId);

      if (!card) {
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              error: 'Tarjeta no encontrada',
              availableCards: creditCards.map(c => ({ id: c.id, name: c.name }))
            })
          }],
          isError: true
        };
      }

      // Generate requirements based on card type
      const requirements = [
        'Cédula de identidad uruguaya',
        'Comprobante de ingresos',
        'Comprobante de domicilio'
      ];

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

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            card: {
              ...card,
              details: {
                monthlyFee: Math.round(card.annualFee / 12),
                interestRate: card.network === 'OCA' ? '28-35%' : '25-45%',
                gracePeriod: '30 días',
                cashAdvanceFee: '4%'
              }
            },
            requirements,
            recommendation: card.recommendation
          }, null, 2)
        }]
      };
    }
  );
}
