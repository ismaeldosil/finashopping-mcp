import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerCatalogResources } from './catalogs.js';
import { registerInstitutionResources } from './institutions.js';

export function registerAllResources(server: McpServer): void {
  registerCatalogResources(server);
  registerInstitutionResources(server);
}
