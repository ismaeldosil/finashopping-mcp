# FinaShopping MCP Server

[![CI](https://github.com/ismaeldosil/finashopping-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/ismaeldosil/finashopping-mcp/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/ismaeldosil/finashopping-mcp/branch/main/graph/badge.svg)](https://codecov.io/gh/ismaeldosil/finashopping-mcp)
[![npm version](https://img.shields.io/npm/v/finashopping-mcp.svg)](https://www.npmjs.com/package/finashopping-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-blue.svg)](https://www.typescriptlang.org/)

MCP Server for interacting with Uruguayan financial products from Claude Desktop.

## Quick Installation

### Option 1: npx (recommended)

Add to your `claude_desktop_config.json`:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "finashopping": {
      "command": "npx",
      "args": ["finashopping-mcp"]
    }
  }
}
```

### Option 2: Global installation

```bash
npm install -g finashopping-mcp
```

Then in `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "finashopping": {
      "command": "finashopping-mcp"
    }
  }
}
```

### Option 3: From source

```bash
git clone https://github.com/ismaeldosil/finashopping-mcp.git
cd finashopping-mcp
npm install
npm run build
```

In `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "finashopping": {
      "command": "node",
      "args": ["/path/to/finashopping-mcp/dist/index.js"]
    }
  }
}
```

## Available Tools

### Loans

| Tool | Description |
|------|-------------|
| `search-loans` | Search loans by amount, term, and type |
| `calculate-loan-payment` | Calculate monthly payment (French amortization) |
| `compare-loans` | Compare multiple loans |
| `get-loan-requirements` | Requirements to apply |

### Cards and Insurance

| Tool | Description |
|------|-------------|
| `search-credit-cards` | Search cards by network and cost |
| `search-insurances` | Search insurance by type |
| `search-guarantees` | Rental guarantee options |
| `get-benefits` | Benefits and discounts |

## Available Resources

| URI | Description |
|-----|-------------|
| `finashopping://loans` | Loan catalog |
| `finashopping://cards` | Card catalog |
| `finashopping://insurance` | Insurance catalog |
| `finashopping://institutions` | Financial institutions |
| `finashopping://credit/ranges` | Credit score ranges |

## Available Prompts

| Prompt | Description |
|--------|-------------|
| `loan-application-guide` | Step-by-step guide to apply for a loan |
| `improve-credit-score` | Tips to improve your score |
| `product-comparison` | Detailed product comparison |
| `financial-faq` | FAQ about finances in Uruguay |

## Usage Examples

Once installed, in Claude Desktop you can ask:

- "Search for personal loans up to $100,000"
- "Calculate the payment for a $50,000 loan at 24 months with 28% rate"
- "Compare credit cards with no annual fee"
- "What do I need to apply for a mortgage?"
- "Give me tips to improve my credit score"

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `FINASHOPPING_API_URL` | `https://finashopping-backend-production.up.railway.app` | Backend API URL |

## Development

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Tests
npm test

# Type check
npm run type-check
```

## Supported Institutions

### Banks
- BROU (Banco Republica)
- Santander Uruguay
- Itau Uruguay
- Scotiabank Uruguay
- BBVA Uruguay

### Insurance
- BSE (Banco de Seguros del Estado)
- Sura Uruguay
- Mapfre Uruguay

### Payment Networks
- OCA
- Visa
- Mastercard

## Troubleshooting

### Server doesn't appear in Claude Desktop

1. Verify that `claude_desktop_config.json` is in the correct location
2. Restart Claude Desktop completely
3. Verify that Node.js 20+ is installed

### Backend connection error

1. Check internet connectivity
2. Backend is at: `https://finashopping-backend-production.up.railway.app/health`

### View MCP Server logs

Logs are written to stderr. In development you can see them in the terminal.

## License

MIT

## URLs

| Service | URL |
|---------|-----|
| Frontend | https://finashopping-frontend.vercel.app |
| Backend API | https://finashopping-backend-production.up.railway.app |
| MCP Server | https://finashopping-mcp-production.up.railway.app |
| API Docs | https://finashopping-backend-production.up.railway.app/api-docs |

## Links

- [FinaShopping Web](https://finashopping-frontend.vercel.app)
- [Backend API Docs](https://finashopping-backend-production.up.railway.app/api-docs)
- [MCP Protocol](https://modelcontextprotocol.io)
- [GitHub Repo](https://github.com/ismaeldosil/finashopping-mcp)
