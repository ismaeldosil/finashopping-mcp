import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  fetchLoans,
  fetchCreditCards,
  fetchInsurances,
  fetchGuarantees,
  fetchBenefits
} from '../api/client.js';
import type { Loan, CreditCard, Insurance, Guarantee, Benefit } from '../api/types.js';

/**
 * Fetch data from API
 */
async function getLoans(): Promise<Loan[]> {
  const response = await fetchLoans();
  return response.loans;
}

async function getCreditCards(): Promise<CreditCard[]> {
  const response = await fetchCreditCards();
  return response.creditCards;
}

async function getInsurances(): Promise<Insurance[]> {
  const response = await fetchInsurances();
  return response.insurances;
}

async function getGuarantees(): Promise<Guarantee[]> {
  const response = await fetchGuarantees();
  return response.guarantees;
}

async function getBenefits(): Promise<Benefit[]> {
  const response = await fetchBenefits();
  return response.benefits;
}

export function registerCatalogResources(server: McpServer): void {
  // Resource: finashopping://loans
  server.resource(
    'loans',
    'finashopping://loans',
    {
      description: 'Complete list of loans available from Uruguayan financial institutions | Lista completa de préstamos disponibles en instituciones financieras uruguayas',
      mimeType: 'application/json'
    },
    async (uri) => {
      const loans = await getLoans();
      return {
        contents: [{
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify({ loans, count: loans.length }, null, 2)
        }]
      };
    }
  );

  // Resource: finashopping://cards
  server.resource(
    'cards',
    'finashopping://cards',
    {
      description: 'Credit cards available in Uruguay | Tarjetas de crédito disponibles en Uruguay',
      mimeType: 'application/json'
    },
    async (uri) => {
      const creditCards = await getCreditCards();
      return {
        contents: [{
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify({ creditCards, count: creditCards.length }, null, 2)
        }]
      };
    }
  );

  // Resource: finashopping://insurance
  server.resource(
    'insurance',
    'finashopping://insurance',
    {
      description: 'Insurance products available in Uruguay | Productos de seguros disponibles en Uruguay',
      mimeType: 'application/json'
    },
    async (uri) => {
      const insurances = await getInsurances();
      return {
        contents: [{
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify({ insurances, count: insurances.length }, null, 2)
        }]
      };
    }
  );

  // Resource: finashopping://guarantees
  server.resource(
    'guarantees',
    'finashopping://guarantees',
    {
      description: 'Rental guarantee options in Uruguay | Opciones de garantía de alquiler en Uruguay',
      mimeType: 'application/json'
    },
    async (uri) => {
      const guarantees = await getGuarantees();
      return {
        contents: [{
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify({ guarantees, count: guarantees.length }, null, 2)
        }]
      };
    }
  );

  // Resource: finashopping://benefits
  server.resource(
    'benefits',
    'finashopping://benefits',
    {
      description: 'Available benefits program | Programa de beneficios disponibles',
      mimeType: 'application/json'
    },
    async (uri) => {
      const benefits = await getBenefits();
      return {
        contents: [{
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify({ benefits, count: benefits.length }, null, 2)
        }]
      };
    }
  );
}
