import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function registerFaqPrompt(server: McpServer): void {
  server.prompt(
    'financial-faq',
    'Preguntas frecuentes sobre finanzas en Uruguay',
    {
      topic: z.string().optional().describe('Tema específico: clearing, score, préstamos, tarjetas')
    },
    ({ topic }) => {
      const topicStr = topic ? ` sobre ${topic}` : '';

      return {
        messages: [{
          role: 'user',
          content: {
            type: 'text',
            text: `Tengo dudas${topicStr} sobre finanzas personales en Uruguay.

Por favor:
1. Lee finashopping://about para conocer los servicios disponibles
2. Lee finashopping://credit/ranges para entender el sistema de score
3. Lee finashopping://institutions para conocer las instituciones

Responde preguntas comunes como:
- ¿Qué es el clearing bancario y cómo afecta?
- ¿Cómo funciona el score crediticio en Uruguay?
- ¿Cuáles son las mejores opciones de préstamos?
- ¿Qué tarjetas no tienen costo anual?
- ¿Qué alternativas de garantía de alquiler existen?

Contextualiza las respuestas para Uruguay, mencionando:
- BCU (Banco Central del Uruguay)
- Clearing de Informes
- BROU como banco estatal
- OCA como red de pagos local`
          }
        }]
      };
    }
  );
}
