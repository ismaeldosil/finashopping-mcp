import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function registerComparisonPrompt(server: McpServer): void {
  server.prompt(
    'product-comparison',
    'Comparación detallada de productos financieros uruguayos',
    {
      productType: z.string().describe('Tipo de producto: préstamos, tarjetas, seguros'),
      priorities: z.string().optional().describe('Qué priorizas: menor tasa, menor cuota, más beneficios')
    },
    ({ productType, priorities }) => {
      const prioritiesStr = priorities ? `\nPriorizo: ${priorities}` : '';

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
            text: `Necesito una comparación detallada de ${productType} en Uruguay.${prioritiesStr}

Por favor:
1. Lee el resource ${resourceSuggestion} para ver el catálogo completo
2. Usa ${toolSuggestion} para buscar opciones
3. Crea una tabla comparativa clara
4. Destaca pros y contras de cada opción
5. Recomienda la mejor opción según mis prioridades

Incluye información de:
- Instituciones uruguayas (BROU, Santander, Itaú, etc.)
- Costos y tasas
- Requisitos
- Beneficios adicionales`
          }
        }]
      };
    }
  );
}
