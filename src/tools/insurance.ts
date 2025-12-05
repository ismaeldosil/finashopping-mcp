import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { insurances, guarantees, benefits } from '../data/test-data.js';

export function registerInsuranceTools(server: McpServer): void {
  // Tool: search-insurances
  server.tool(
    'search-insurances',
    'Buscar seguros disponibles en Uruguay. Incluye seguros de vida, auto, hogar y más.',
    {
      type: z.string().optional().describe('Tipo de seguro (vida, auto, hogar)')
    },
    async ({ type }) => {
      let filteredInsurances = [...insurances];

      if (type) {
        const searchType = type.toLowerCase();
        filteredInsurances = filteredInsurances.filter(ins =>
          ins.type.toLowerCase().includes(searchType)
        );
      }

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            insurances: filteredInsurances,
            count: filteredInsurances.length,
            availableTypes: [...new Set(insurances.map(i => i.type))]
          }, null, 2)
        }]
      };
    }
  );

  // Tool: search-guarantees
  server.tool(
    'search-guarantees',
    'Buscar opciones de garantía de alquiler disponibles en Uruguay.',
    {},
    async () => {
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            guarantees,
            count: guarantees.length,
            tip: 'Las garantías de alquiler son alternativas al depósito tradicional para arrendar viviendas en Uruguay.'
          }, null, 2)
        }]
      };
    }
  );

  // Tool: get-benefits
  server.tool(
    'get-benefits',
    'Obtener beneficios y descuentos disponibles para usuarios de productos financieros.',
    {
      category: z.string().optional().describe('Categoría de beneficio (Alimentación, Entretenimiento, Servicios, Combustible)')
    },
    async ({ category }) => {
      let filteredBenefits = [...benefits];

      if (category) {
        filteredBenefits = filteredBenefits.filter(b =>
          b.category.toLowerCase().includes(category.toLowerCase())
        );
      }

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            benefits: filteredBenefits,
            count: filteredBenefits.length,
            categories: [...new Set(benefits.map(b => b.category))]
          }, null, 2)
        }]
      };
    }
  );
}
