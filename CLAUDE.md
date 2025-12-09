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

## Project Structure

```
finashopping-mcp/
├── src/
│   ├── index.ts              # Entry point (stdio transport)
│   ├── server.ts             # MCP Server setup
│   ├── tools/                # MCP Tools
│   │   ├── loans.ts          # search-loans, calculate-loan-payment, compare-loans
│   │   ├── cards.ts          # search-credit-cards, get-card-details
│   │   ├── insurance.ts      # search-insurances, search-guarantees, get-benefits
│   │   └── index.ts
│   ├── resources/            # MCP Resources
│   │   ├── catalogs.ts       # loans, cards, insurance, guarantees, benefits
│   │   ├── institutions.ts   # institutions, credit-ranges, about
│   │   └── index.ts
│   ├── prompts/              # MCP Prompts
│   │   ├── loan-guide.ts     # loan-application-guide
│   │   ├── credit-tips.ts    # improve-credit-score
│   │   ├── comparison.ts     # product-comparison
│   │   ├── faq.ts            # financial-faq
│   │   └── index.ts
│   ├── api/                  # Backend API client
│   │   ├── client.ts         # Axios client with JWT auth
│   │   ├── types.ts          # Response types
│   │   └── index.ts
│   ├── utils/                # Utility functions
│   │   ├── calculations.ts   # French amortization calculations
│   │   ├── filters.ts        # Loan/card/insurance filters
│   │   ├── requirements.ts   # Requirements generation
│   │   └── index.ts
│   └── data/
│       └── test-data.ts      # Static data (institutions, credit ranges)
├── tests/
│   ├── api/
│   │   └── client.test.ts
│   ├── tools/
│   │   └── tools.test.ts
│   ├── resources/
│   │   └── resources.test.ts
│   ├── prompts/
│   │   └── prompts.test.ts
│   ├── utils/
│   │   ├── calculations.test.ts
│   │   ├── filters.test.ts
│   │   └── requirements.test.ts
│   ├── mocks/
│   │   └── api.ts
│   ├── server.test.ts
│   └── setup.ts
├── .github/
│   └── workflows/
│       └── ci.yml            # GitHub Actions CI
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── .eslintrc.json
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

**Backend API URLs:**
- Producción: `https://finashopping-backend-production.up.railway.app`
- Local: `http://localhost:8787`

**MCP Server URLs:**
- Producción: `https://finashopping-mcp-production.up.railway.app`
- Local: `http://localhost:3000` (HTTP transport) o stdio (default)

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

# Coverage (requires 90%+ for lines, functions, statements; 80%+ for branches)
npm run test:coverage

# Test specific file
npm test -- tools/loans
```

### Coverage Thresholds

| Metric | Threshold | Current |
|--------|-----------|---------|
| Lines | 90% | 99.81% |
| Functions | 90% | 100% |
| Branches | 80% | 98.61% |
| Statements | 90% | 99.81% |

### CI/CD

GitHub Actions runs on every push/PR to `main` and `develop`:
- Lint check
- Type check
- Tests with coverage (Node.js 20.x and 22.x)
- Codecov upload
- Build verification

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

*Last updated: 2025-12-09*
