import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function registerLoanGuidePrompt(server: McpServer): void {
  server.prompt(
    'loan-application-guide',
    'Guía paso a paso para solicitar un préstamo en Uruguay',
    {
      loanType: z.string().describe('Tipo de préstamo: personal, auto o hipotecario'),
      amount: z.string().optional().describe('Monto aproximado en pesos uruguayos'),
      term: z.string().optional().describe('Plazo deseado en meses')
    },
    ({ loanType, amount, term }) => {
      const amountStr = amount ? `\nMonto aproximado: $${Number(amount).toLocaleString('es-UY')}` : '';
      const termStr = term ? `\nPlazo deseado: ${term} meses` : '';

      return {
        messages: [{
          role: 'user',
          content: {
            type: 'text',
            text: `Ayúdame a solicitar un préstamo ${loanType} en Uruguay.${amountStr}${termStr}

Por favor:
1. Usa el tool search-loans para encontrar opciones de préstamos ${loanType}
2. Para cada opción, calcula la cuota con calculate-loan-payment
3. Usa get-loan-requirements para explicar los requisitos de cada institución
4. Recomienda la mejor opción considerando tasa, plazo y probabilidad de aprobación
5. Indica los próximos pasos para solicitar

Contexto: Los principales bancos en Uruguay son BROU, Santander, Itaú, Scotiabank y BBVA. Las tasas típicas van de 20% a 40% anual para préstamos personales.`
          }
        }]
      };
    }
  );
}
