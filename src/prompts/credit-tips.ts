import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function registerCreditTipsPrompt(server: McpServer): void {
  server.prompt(
    'improve-credit-score',
    'Consejos para mejorar tu score crediticio en Uruguay',
    {
      currentScore: z.string().optional().describe('Tu score actual (300-850)'),
      concerns: z.string().optional().describe('Preocupaciones específicas (deudas, clearing, etc.)')
    },
    ({ currentScore, concerns }) => {
      const scoreStr = currentScore ? `Mi score actual es aproximadamente ${currentScore}.` : '';
      const concernsStr = concerns ? `\nMis preocupaciones específicas: ${concerns}` : '';

      return {
        messages: [{
          role: 'user',
          content: {
            type: 'text',
            text: `Quiero mejorar mi score crediticio en Uruguay. ${scoreStr}${concernsStr}

Por favor:
1. Lee el resource finashopping://credit/ranges para entender los rangos
2. Explica cómo funciona el score crediticio en Uruguay
3. Dame consejos específicos y accionables para mejorar mi score
4. Menciona cuánto tiempo típicamente toma ver mejoras
5. Advierte sobre prácticas que pueden dañar el score

Considera factores uruguayos como:
- Clearing bancario
- Historial en BROU (banco estatal)
- Comportamiento con tarjetas OCA
- Pagos de servicios públicos (UTE, OSE, Antel)`
          }
        }]
      };
    }
  );
}
