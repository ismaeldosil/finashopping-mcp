import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { fetchCreditCards } from '../api/client.js';
import type { CreditCard } from '../api/types.js';

/**
 * Fetch credit cards from API
 */
async function getCreditCards(): Promise<CreditCard[]> {
  const response = await fetchCreditCards();
  return response.creditCards;
}

export function registerCardTools(server: McpServer): void {
  // Tool: search-credit-cards
  server.tool(
    'search-credit-cards',
    'Search available credit cards in Uruguay. Filter by payment network and maximum annual fee. | Buscar tarjetas de crédito disponibles en Uruguay. Filtrar por red de pago y costo anual máximo.',
    {
      network: z.enum(['OCA', 'Visa', 'Mastercard']).optional().describe('Payment network | Red de pago'),
      maxAnnualFee: z.number().min(0).optional().describe('Maximum annual fee in Uruguayan pesos | Costo anual máximo en pesos uruguayos')
    },
    async ({ network, maxAnnualFee }) => {
      const creditCards = await getCreditCards();
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
              ? 'You found cards with no annual fee! | Encontraste tarjetas sin costo anual!'
              : 'Tip: Use maxAnnualFee: 0 to see only free cards | Tip: Usa maxAnnualFee: 0 para ver solo tarjetas gratis'
          }, null, 2)
        }]
      };
    }
  );

  // Tool: get-card-details
  server.tool(
    'get-card-details',
    'Get complete details for a specific credit card. | Obtener detalles completos de una tarjeta de crédito específica.',
    {
      cardId: z.number().describe('Card ID | ID de la tarjeta')
    },
    async ({ cardId }) => {
      const creditCards = await getCreditCards();
      const card = creditCards.find(c => c.id === cardId);

      if (!card) {
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              error: 'Card not found | Tarjeta no encontrada',
              availableCards: creditCards.map(c => ({ id: c.id, name: c.name }))
            })
          }],
          isError: true
        };
      }

      // Generate requirements based on card type (bilingual)
      const requirements = [
        'Uruguayan ID card | Cédula de identidad uruguaya',
        'Proof of income | Comprobante de ingresos',
        'Proof of address | Comprobante de domicilio'
      ];

      if (card.currency === 'USD' || card.limit > 300000) {
        requirements.push(
          'Minimum income: $U 60,000 monthly | Ingresos mínimos: $U 60.000 mensuales',
          'Employment history: 1 year | Antigüedad laboral: 1 año'
        );
      } else {
        requirements.push(
          'Minimum income: $U 25,000 monthly | Ingresos mínimos: $U 25.000 mensuales',
          'Employment history: 6 months | Antigüedad laboral: 6 meses'
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
                gracePeriod: '30 days | días',
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
