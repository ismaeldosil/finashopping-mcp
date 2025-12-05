import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { loans, creditCards, insurances, guarantees, benefits } from '../data/test-data.js';

export function registerCatalogResources(server: McpServer): void {
  // Resource: finashopping://loans
  server.resource(
    'loans',
    'finashopping://loans',
    {
      description: 'Lista completa de préstamos disponibles en instituciones financieras uruguayas',
      mimeType: 'application/json'
    },
    async (uri) => ({
      contents: [{
        uri: uri.href,
        mimeType: 'application/json',
        text: JSON.stringify({ loans, count: loans.length }, null, 2)
      }]
    })
  );

  // Resource: finashopping://cards
  server.resource(
    'cards',
    'finashopping://cards',
    {
      description: 'Tarjetas de crédito disponibles en Uruguay',
      mimeType: 'application/json'
    },
    async (uri) => ({
      contents: [{
        uri: uri.href,
        mimeType: 'application/json',
        text: JSON.stringify({ creditCards, count: creditCards.length }, null, 2)
      }]
    })
  );

  // Resource: finashopping://insurance
  server.resource(
    'insurance',
    'finashopping://insurance',
    {
      description: 'Productos de seguros disponibles en Uruguay',
      mimeType: 'application/json'
    },
    async (uri) => ({
      contents: [{
        uri: uri.href,
        mimeType: 'application/json',
        text: JSON.stringify({ insurances, count: insurances.length }, null, 2)
      }]
    })
  );

  // Resource: finashopping://guarantees
  server.resource(
    'guarantees',
    'finashopping://guarantees',
    {
      description: 'Opciones de garantía de alquiler en Uruguay',
      mimeType: 'application/json'
    },
    async (uri) => ({
      contents: [{
        uri: uri.href,
        mimeType: 'application/json',
        text: JSON.stringify({ guarantees, count: guarantees.length }, null, 2)
      }]
    })
  );

  // Resource: finashopping://benefits
  server.resource(
    'benefits',
    'finashopping://benefits',
    {
      description: 'Programa de beneficios disponibles',
      mimeType: 'application/json'
    },
    async (uri) => ({
      contents: [{
        uri: uri.href,
        mimeType: 'application/json',
        text: JSON.stringify({ benefits, count: benefits.length }, null, 2)
      }]
    })
  );
}
