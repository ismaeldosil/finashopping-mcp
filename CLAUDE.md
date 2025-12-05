# CLAUDE.md - FinaShopping MCP Server

Guía para desarrollo del MCP Server de FinaShopping.

## Stack

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Node.js | 20+ | Runtime |
| TypeScript | 5.5+ | Language (strict mode) |
| @modelcontextprotocol/sdk | 1.x | MCP SDK oficial |
| Zod | 3.25+ | Schema validation |
| Axios | 1.7+ | HTTP client para backend API |
| tsx | 4.x | Dev runner |
| Vitest | 2.x | Testing |

## ¿Qué es MCP?

**Model Context Protocol (MCP)** es un protocolo abierto de Anthropic que permite conectar asistentes de IA (como Claude) con fuentes de datos y herramientas externas.

Este MCP Server permite a usuarios de Claude Desktop:
- Buscar préstamos, tarjetas y seguros uruguayos
- Calcular cuotas de préstamos
- Comparar productos financieros
- Obtener información del mercado financiero uruguayo

## Desarrollo

```bash
npm install          # Instalar dependencias
npm run dev          # Desarrollo con tsx (stdio)
npm run build        # Compilar TypeScript
npm start            # Ejecutar server compilado
npm test             # Unit tests (Vitest)
npm run lint         # ESLint
npm run type-check   # TypeScript check
```

## Estructura del Proyecto

```
finashopping-mcp/
├── src/
│   ├── index.ts              # Entry point (stdio transport)
│   ├── server.ts             # MCP Server setup
│   ├── tools/                # MCP Tools
│   │   ├── loans.ts          # search-loans, calculate-loan-payment
│   │   ├── cards.ts          # search-credit-cards
│   │   ├── insurance.ts      # search-insurances
│   │   ├── calculator.ts     # Calculadoras financieras
│   │   └── index.ts
│   ├── resources/            # MCP Resources
│   │   ├── catalogs.ts       # Catálogos de productos
│   │   ├── institutions.ts   # Instituciones financieras
│   │   ├── credit.ts         # Info de crédito
│   │   └── index.ts
│   ├── prompts/              # MCP Prompts
│   │   ├── loan-guide.ts     # Guía de solicitud
│   │   ├── credit-tips.ts    # Tips de crédito
│   │   └── index.ts
│   ├── api/                  # Backend API client
│   │   ├── client.ts         # Axios client
│   │   └── types.ts          # Response types
│   └── utils/
│       └── validation.ts     # Zod schemas compartidos
├── tests/
│   ├── tools/
│   ├── resources/
│   └── setup.ts
├── examples/
│   └── claude-desktop-config.json
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

## Conceptos Clave de MCP

### Tools
Funciones que Claude puede invocar para realizar acciones o consultar datos.

```typescript
server.registerTool(
  'tool-name',
  {
    title: 'Tool Title',
    description: 'What this tool does',
    inputSchema: { param: z.string() },
    outputSchema: { result: z.string() }
  },
  async ({ param }) => {
    // Implementación
    return { content: [{ type: 'text', text: 'result' }] };
  }
);
```

### Resources
Datos estáticos o semi-estáticos que Claude puede leer.

```typescript
server.registerResource(
  'resource-name',
  'finashopping://path',
  { title: 'Resource Title', mimeType: 'application/json' },
  async (uri) => ({
    contents: [{ uri: uri.href, text: JSON.stringify(data) }]
  })
);
```

### Prompts
Templates predefinidos para guiar conversaciones.

```typescript
server.registerPrompt(
  'prompt-name',
  {
    name: 'prompt-name',
    description: 'What this prompt helps with',
    arguments: [{ name: 'arg1', required: true }]
  },
  async ({ arg1 }) => ({
    messages: [{
      role: 'user',
      content: { type: 'text', text: `Prompt with ${arg1}` }
    }]
  })
);
```

## Backend API

El MCP Server consume la API REST del backend:

| Endpoint | Descripción |
|----------|-------------|
| GET /api/v1/loans | Catálogo de préstamos |
| GET /api/v1/credit-cards | Tarjetas de crédito |
| GET /api/v1/insurances | Seguros |
| GET /api/v1/guarantees | Garantías de alquiler |
| GET /api/v1/benefits | Beneficios y descuentos |

**Base URLs:**
- Producción: `https://finashopping-backend-production.up.railway.app`
- Local: `http://localhost:8787`

## Variables de Entorno

```bash
FINASHOPPING_API_URL=https://finashopping-backend-production.up.railway.app
```

## Agentes

Ver `.claude/agents/mcp/README.md` en `finashopping-docs` para lista completa.

| Agente | Cuándo usar |
|--------|-------------|
| @mcp-developer | Crear tools, resources, prompts |
| @mcp-tester | Tests con Vitest |
| @code-reviewer | Review antes de commit |

## Testing

```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# Test específico
npm test -- tools/loans
```

## Instalación en Claude Desktop

### macOS
```json
// ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "finashopping": {
      "command": "npx",
      "args": ["finashopping-mcp"]
    }
  }
}
```

### Windows
```json
// %APPDATA%\Claude\claude_desktop_config.json
{
  "mcpServers": {
    "finashopping": {
      "command": "npx",
      "args": ["finashopping-mcp"]
    }
  }
}
```

## Documentación

| Doc | Ruta |
|-----|------|
| MCP SDK | https://github.com/modelcontextprotocol/typescript-sdk |
| MCP Specification | https://modelcontextprotocol.io/specification |
| Backend API | `../finashopping-docs/backend/api/API-Reference.md` |
| Roadmap MCP | `../finashopping-docs/mcp/ROADMAP.md` |

## Gitflow

**OBLIGATORIO** seguir Gitflow. Ver: `../finashopping-docs/shared/guides/gitflow.md`

```bash
# Flujo rápido
git checkout develop && git pull
git checkout -b feature/<issue>-descripcion
# ... desarrollar ...
git commit -m "feat(mcp): descripción - Closes #<issue>"
gh pr create && gh pr merge --squash
git checkout main && git pull
git checkout develop && git merge main && git push
```

---

*Última actualización: 2025-12-05*
