import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function registerFaqPrompt(server: McpServer): void {
  server.prompt(
    'financial-faq',
    'Frequently asked questions about finances in Uruguay | Preguntas frecuentes sobre finanzas en Uruguay',
    {
      topic: z.string().optional().describe('Specific topic: clearing, score, loans, cards | Tema específico: clearing, score, préstamos, tarjetas')
    },
    ({ topic }) => {
      const topicStr = topic ? ` about ${topic} | sobre ${topic}` : '';

      return {
        messages: [{
          role: 'user',
          content: {
            type: 'text',
            text: `I have questions${topicStr} about personal finances in Uruguay. | Tengo dudas${topicStr} sobre finanzas personales en Uruguay.

Please | Por favor:
1. Read finashopping://about to learn about available services | Lee finashopping://about para conocer los servicios disponibles
2. Read finashopping://credit/ranges to understand the score system | Lee finashopping://credit/ranges para entender el sistema de score
3. Read finashopping://institutions to learn about the institutions | Lee finashopping://institutions para conocer las instituciones

Answer common questions | Responde preguntas comunes como:
- What is bank clearing and how does it affect me? | ¿Qué es el clearing bancario y cómo afecta?
- How does the credit score work in Uruguay? | ¿Cómo funciona el score crediticio en Uruguay?
- What are the best loan options? | ¿Cuáles son las mejores opciones de préstamos?
- Which credit cards have no annual fee? | ¿Qué tarjetas no tienen costo anual?
- What rental guarantee alternatives exist? | ¿Qué alternativas de garantía de alquiler existen?

Contextualize responses for Uruguay, mentioning | Contextualiza las respuestas para Uruguay, mencionando:
- BCU (Central Bank of Uruguay | Banco Central del Uruguay)
- Clearing de Informes (Credit Bureau)
- BROU as the state bank | BROU como banco estatal
- OCA as the local payment network | OCA como red de pagos local`
          }
        }]
      };
    }
  );
}
