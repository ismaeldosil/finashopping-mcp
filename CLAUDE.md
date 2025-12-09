# CLAUDE.md - FinaShopping MCP Server

Development guide for the FinaShopping MCP Server.

## Stack

| Technology | Version | Use |
|------------|---------|-----|
| Node.js | 20+ | Runtime |
| TypeScript | 5.5+ | Language (strict mode) |
| @modelcontextprotocol/sdk | 1.x | Official MCP SDK |
| Zod | 3.25+ | Schema validation |
| Axios | 1.7+ | HTTP client for backend API |
| tsx | 4.x | Dev runner |
| Vitest | 2.x | Testing |

## What is MCP?

**Model Context Protocol (MCP)** is an open protocol from Anthropic that allows connecting AI assistants (like Claude) with external data sources and tools.

This MCP Server allows Claude Desktop users to:
- Search for Uruguayan loans, cards, and insurance
- Calculate loan payments
- Compare financial products
- Get information about the Uruguayan financial market

## Development

```bash
npm install          # Install dependencies
npm run dev          # Development with tsx (stdio)
npm run build        # Compile TypeScript
npm start            # Run compiled server
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

## Key MCP Concepts

### Tools
Functions that Claude can invoke to perform actions or query data.

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
    // Implementation
    return { content: [{ type: 'text', text: 'result' }] };
  }
);
```

### Resources
Static or semi-static data that Claude can read.

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
Predefined templates to guide conversations.

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

The MCP Server consumes the backend REST API:

| Endpoint | Description |
|----------|-------------|
| GET /api/v1/loans | Loan catalog |
| GET /api/v1/credit-cards | Credit cards |
| GET /api/v1/insurances | Insurance |
| GET /api/v1/guarantees | Rental guarantees |
| GET /api/v1/benefits | Benefits and discounts |

**Backend API URLs:**
- Production: `https://finashopping-backend-production.up.railway.app`
- Local: `http://localhost:8787`

**MCP Server URLs:**
- Production: `https://finashopping-mcp-production.up.railway.app`
- Local: `http://localhost:3000` (HTTP transport) or stdio (default)

## Environment Variables

```bash
FINASHOPPING_API_URL=https://finashopping-backend-production.up.railway.app
```

## Agents

See `.claude/agents/mcp/README.md` in `finashopping-docs` for full list.

| Agent | When to use |
|-------|-------------|
| @mcp-developer | Create tools, resources, prompts |
| @mcp-tester | Tests with Vitest |
| @code-reviewer | Review before commit |

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

## Installation in Claude Desktop

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

## Documentation

| Doc | Path |
|-----|------|
| MCP SDK | https://github.com/modelcontextprotocol/typescript-sdk |
| MCP Specification | https://modelcontextprotocol.io/specification |
| Backend API | `../finashopping-docs/backend/api/API-Reference.md` |
| Roadmap MCP | `../finashopping-docs/mcp/ROADMAP.md` |

## Gitflow

**REQUIRED** to follow Gitflow. See: `../finashopping-docs/shared/guides/gitflow.md`

```bash
# Quick flow
git checkout develop && git pull
git checkout -b feature/<issue>-description
# ... develop ...
git commit -m "feat(mcp): description - Closes #<issue>"
gh pr create && gh pr merge --squash
git checkout main && git pull
git checkout develop && git merge main && git push
```

---

*Last updated: 2025-12-09*
