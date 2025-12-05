#!/usr/bin/env node

import { createServer as createHttpServer } from 'http';
import { createServer } from './server.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

const PORT = parseInt(process.env.PORT || '3000', 10);

/**
 * FinaShopping MCP Server - HTTP Transport
 *
 * For deployment on Railway or similar platforms
 */
async function main(): Promise<void> {
  const mcpServer = createServer();

  // Create HTTP server with health check
  const httpServer = createHttpServer(async (req, res) => {
    // Health check endpoint
    if (req.url === '/health' || req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'ok',
        name: 'finashopping-mcp',
        version: '0.1.0',
        timestamp: new Date().toISOString()
      }));
      return;
    }

    // MCP endpoint
    if (req.url === '/mcp' && req.method === 'POST') {
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => crypto.randomUUID()
      });

      await mcpServer.connect(transport);

      // Handle the request through the transport
      await transport.handleRequest(req, res);
      return;
    }

    // 404 for other routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  });

  httpServer.listen(PORT, () => {
    console.error(`[FinaShopping MCP] HTTP server listening on port ${PORT}`);
    console.error(`[FinaShopping MCP] Health check: http://localhost:${PORT}/health`);
    console.error(`[FinaShopping MCP] MCP endpoint: http://localhost:${PORT}/mcp`);
  });
}

main().catch((error) => {
  console.error('[FinaShopping MCP] Fatal error:', error);
  process.exit(1);
});
