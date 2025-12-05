import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerLoanGuidePrompt } from './loan-guide.js';
import { registerCreditTipsPrompt } from './credit-tips.js';
import { registerComparisonPrompt } from './comparison.js';
import { registerFaqPrompt } from './faq.js';

export function registerAllPrompts(server: McpServer): void {
  registerLoanGuidePrompt(server);
  registerCreditTipsPrompt(server);
  registerComparisonPrompt(server);
  registerFaqPrompt(server);
}
