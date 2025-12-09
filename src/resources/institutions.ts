import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { institutions, creditScoreRanges } from '../data/test-data.js';

export function registerInstitutionResources(server: McpServer): void {
  // Resource: finashopping://institutions
  server.resource(
    'institutions',
    'finashopping://institutions',
    {
      description: 'List of banks, insurance companies, and payment networks in Uruguay | Lista de bancos, aseguradoras y redes de pago en Uruguay',
      mimeType: 'application/json'
    },
    async (uri) => ({
      contents: [{
        uri: uri.href,
        mimeType: 'application/json',
        text: JSON.stringify(institutions, null, 2)
      }]
    })
  );

  // Resource: finashopping://credit/ranges
  server.resource(
    'credit-ranges',
    'finashopping://credit/ranges',
    {
      description: 'Credit score ranges and classifications in Uruguay | Rangos y clasificaciones del score crediticio en Uruguay',
      mimeType: 'application/json'
    },
    async (uri) => ({
      contents: [{
        uri: uri.href,
        mimeType: 'application/json',
        text: JSON.stringify({
          ranges: creditScoreRanges,
          description: 'Credit scores in Uruguay range from 300 to 850 points. A higher score indicates better credit history and higher probability of credit approval. | El score crediticio en Uruguay va de 300 a 850 puntos. Un score más alto indica mejor historial crediticio y mayor probabilidad de aprobación de créditos.'
        }, null, 2)
      }]
    })
  );

  // Resource: finashopping://about
  server.resource(
    'about',
    'finashopping://about',
    {
      description: 'Information about the FinaShopping platform | Información sobre la plataforma FinaShopping',
      mimeType: 'application/json'
    },
    async (uri) => ({
      contents: [{
        uri: uri.href,
        mimeType: 'application/json',
        text: JSON.stringify({
          name: 'FinaShopping',
          description: 'Uruguayan financial products comparison platform | Plataforma de comparación de productos financieros uruguayos',
          features: [
            'Loan comparison from multiple institutions | Comparación de préstamos de múltiples instituciones',
            'Credit card catalog | Catálogo de tarjetas de crédito',
            'Insurance and rental guarantees | Seguros y garantías de alquiler',
            'Financial calculator | Calculadora financiera',
            'Credit score information | Información de score crediticio'
          ],
          coverage: 'Uruguay',
          institutions: {
            banks: institutions.banks.length,
            insurers: institutions.insurers.length,
            paymentNetworks: institutions.networks.length
          },
          website: 'https://finashopping-frontend.vercel.app',
          apiDocs: 'https://finashopping-backend-production.up.railway.app/api-docs'
        }, null, 2)
      }]
    })
  );
}
