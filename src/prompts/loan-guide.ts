import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function registerLoanGuidePrompt(server: McpServer): void {
  server.prompt(
    'loan-application-guide',
    'Step-by-step guide to apply for a loan in Uruguay | Guía paso a paso para solicitar un préstamo en Uruguay',
    {
      loanType: z.string().describe('Loan type: personal, auto, or mortgage | Tipo de préstamo: personal, auto o hipotecario'),
      amount: z.string().optional().describe('Approximate amount in Uruguayan pesos | Monto aproximado en pesos uruguayos'),
      term: z.string().optional().describe('Desired term in months | Plazo deseado en meses')
    },
    ({ loanType, amount, term }) => {
      const amountStr = amount ? `\nApproximate amount | Monto aproximado: $${Number(amount).toLocaleString('es-UY')}` : '';
      const termStr = term ? `\nDesired term | Plazo deseado: ${term} months | meses` : '';

      return {
        messages: [{
          role: 'user',
          content: {
            type: 'text',
            text: `Help me apply for a ${loanType} loan in Uruguay. | Ayúdame a solicitar un préstamo ${loanType} en Uruguay.${amountStr}${termStr}

Please | Por favor:
1. Use the search-loans tool to find ${loanType} loan options | Usa el tool search-loans para encontrar opciones de préstamos ${loanType}
2. For each option, calculate the payment with calculate-loan-payment | Para cada opción, calcula la cuota con calculate-loan-payment
3. Use get-loan-requirements to explain the requirements | Usa get-loan-requirements para explicar los requisitos
4. Recommend the best option | Recomienda la mejor opción
5. Indicate the next steps | Indica los próximos pasos

Context: The main banks in Uruguay are BROU, Santander, Itau, Scotiabank, and BBVA. Typical rates range from 20% to 40% annually for personal loans. | Contexto: Los principales bancos en Uruguay son BROU, Santander, Itaú, Scotiabank y BBVA. Las tasas típicas van de 20% a 40% anual para préstamos personales.`
          }
        }]
      };
    }
  );
}
