import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function registerComparisonPrompt(server: McpServer): void {
  server.prompt(
    'product-comparison',
    'Detailed comparison of Uruguayan financial products | Comparación detallada de productos financieros uruguayos',
    {
      productType: z.string().describe('Product type: loans, cards, insurance | Tipo de producto: préstamos, tarjetas, seguros'),
      priorities: z.string().optional().describe('What you prioritize: lowest rate, lowest payment, more benefits | Qué priorizas: menor tasa, menor cuota, más beneficios')
    },
    ({ productType, priorities }) => {
      const prioritiesStr = priorities ? `\nI prioritize | Priorizo: ${priorities}` : '';

      let toolSuggestion = '';
      let resourceSuggestion = '';

      switch (productType.toLowerCase()) {
        case 'préstamos':
        case 'prestamos':
        case 'loans':
          toolSuggestion = 'search-loans';
          resourceSuggestion = 'finashopping://loans';
          break;
        case 'tarjetas':
        case 'cards':
          toolSuggestion = 'search-credit-cards';
          resourceSuggestion = 'finashopping://cards';
          break;
        case 'seguros':
        case 'insurance':
          toolSuggestion = 'search-insurances';
          resourceSuggestion = 'finashopping://insurance';
          break;
        default:
          toolSuggestion = 'search-loans, search-credit-cards, search-insurances';
          resourceSuggestion = 'finashopping://loans, finashopping://cards, finashopping://insurance';
      }

      return {
        messages: [{
          role: 'user',
          content: {
            type: 'text',
            text: `I need a detailed comparison of ${productType} in Uruguay. | Necesito una comparación detallada de ${productType} en Uruguay.${prioritiesStr}

Please | Por favor:
1. Read the resource ${resourceSuggestion} to see the complete catalog | Lee el resource ${resourceSuggestion} para ver el catálogo completo
2. Use ${toolSuggestion} to search for options | Usa ${toolSuggestion} para buscar opciones
3. Create a clear comparison table | Crea una tabla comparativa clara
4. Highlight pros and cons | Destaca pros y contras
5. Recommend the best option | Recomienda la mejor opción

Include information about | Incluye información de:
- Uruguayan institutions (BROU, Santander, Itau, etc.) | Instituciones uruguayas
- Costs and rates | Costos y tasas
- Requirements | Requisitos
- Additional benefits | Beneficios adicionales`
          }
        }]
      };
    }
  );
}
