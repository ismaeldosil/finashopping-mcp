import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerLoanTools } from './loans.js';
import { registerCardTools } from './cards.js';
import { registerInsuranceTools } from './insurance.js';

export function registerAllTools(server: McpServer): void {
  registerLoanTools(server);
  registerCardTools(server);
  registerInsuranceTools(server);
}
