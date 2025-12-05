#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';

/**
 * FinaShopping MCP Server
 *
 * Entry point for stdio transport (Claude Desktop)
 *
 * Usage:
 *   npx finashopping-mcp
 *   node dist/index.js
 */
async function main(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();

  // Log to stderr (stdout is for MCP protocol)
  console.error('[FinaShopping MCP] Starting server...');

  await server.connect(transport);

  console.error('[FinaShopping MCP] Server connected via stdio');
}

main().catch((error) => {
  console.error('[FinaShopping MCP] Fatal error:', error);
  process.exit(1);
});
