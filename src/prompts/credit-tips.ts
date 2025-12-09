import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function registerCreditTipsPrompt(server: McpServer): void {
  server.prompt(
    'improve-credit-score',
    'Tips to improve your credit score in Uruguay | Consejos para mejorar tu score crediticio en Uruguay',
    {
      currentScore: z.string().optional().describe('Your current score (300-850) | Tu score actual (300-850)'),
      concerns: z.string().optional().describe('Specific concerns (debts, clearing, etc.) | Preocupaciones específicas (deudas, clearing, etc.)')
    },
    ({ currentScore, concerns }) => {
      const scoreStr = currentScore ? `My current score is approximately ${currentScore}. | Mi score actual es aproximadamente ${currentScore}.` : '';
      const concernsStr = concerns ? `\nMy specific concerns | Mis preocupaciones específicas: ${concerns}` : '';

      return {
        messages: [{
          role: 'user',
          content: {
            type: 'text',
            text: `I want to improve my credit score in Uruguay. | Quiero mejorar mi score crediticio en Uruguay. ${scoreStr}${concernsStr}

Please | Por favor:
1. Read the resource finashopping://credit/ranges to understand the ranges | Lee el resource finashopping://credit/ranges para entender los rangos
2. Explain how the credit score works in Uruguay | Explica cómo funciona el score crediticio en Uruguay
3. Give me specific and actionable tips | Dame consejos específicos y accionables
4. Mention how long it typically takes to see improvements | Menciona cuánto tiempo típicamente toma ver mejoras
5. Warn about practices that can damage the score | Advierte sobre prácticas que pueden dañar el score

Consider Uruguayan factors | Considera factores uruguayos como:
- Bank clearing | Clearing bancario
- History with BROU (state bank) | Historial en BROU (banco estatal)
- Behavior with OCA cards | Comportamiento con tarjetas OCA
- Public utility payments (UTE, OSE, Antel) | Pagos de servicios públicos (UTE, OSE, Antel)`
          }
        }]
      };
    }
  );
}
