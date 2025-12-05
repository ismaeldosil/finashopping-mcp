import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerAllTools } from './tools/index.js';
import { registerAllResources } from './resources/index.js';
import { registerAllPrompts } from './prompts/index.js';

/**
 * Create and configure the FinaShopping MCP Server
 */
export function createServer(): McpServer {
  const server = new McpServer({
    name: 'finashopping-mcp',
    version: '0.1.0'
  });

  // Register all components
  registerAllTools(server);
  registerAllResources(server);
  registerAllPrompts(server);

  return server;
}
