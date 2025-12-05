# FinaShopping MCP Server

MCP Server para interactuar con productos financieros uruguayos desde Claude Desktop.

## Instalación Rápida

### Opción 1: npx (recomendado)

Agrega a tu `claude_desktop_config.json`:

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

### Opción 2: Instalación global

```bash
npm install -g finashopping-mcp
```

Luego en `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "finashopping": {
      "command": "finashopping-mcp"
    }
  }
}
```

### Opción 3: Desde código fuente

```bash
git clone https://github.com/ismaeldosil/finashopping-mcp.git
cd finashopping-mcp
npm install
npm run build
```

En `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "finashopping": {
      "command": "node",
      "args": ["/ruta/a/finashopping-mcp/dist/index.js"]
    }
  }
}
```

## Herramientas Disponibles

### Préstamos

| Tool | Descripción |
|------|-------------|
| `search-loans` | Buscar préstamos por monto, plazo y tipo |
| `calculate-loan-payment` | Calcular cuota mensual (sistema francés) |
| `compare-loans` | Comparar múltiples préstamos |
| `get-loan-requirements` | Requisitos para solicitar |

### Tarjetas y Seguros

| Tool | Descripción |
|------|-------------|
| `search-credit-cards` | Buscar tarjetas por red y costo |
| `search-insurances` | Buscar seguros por tipo |
| `search-guarantees` | Opciones de garantía de alquiler |
| `get-benefits` | Beneficios y descuentos |

## Recursos Disponibles

| URI | Descripción |
|-----|-------------|
| `finashopping://loans` | Catálogo de préstamos |
| `finashopping://cards` | Catálogo de tarjetas |
| `finashopping://insurance` | Catálogo de seguros |
| `finashopping://institutions` | Instituciones financieras |
| `finashopping://credit/ranges` | Rangos de score crediticio |

## Prompts Disponibles

| Prompt | Descripción |
|--------|-------------|
| `loan-application-guide` | Guía paso a paso para solicitar préstamo |
| `improve-credit-score` | Consejos para mejorar score |
| `product-comparison` | Comparación detallada de productos |
| `financial-faq` | FAQ sobre finanzas en Uruguay |

## Ejemplos de Uso

Una vez instalado, en Claude Desktop puedes preguntar:

- "Busca préstamos personales de hasta $100,000"
- "Calcula la cuota de un préstamo de $50,000 a 24 meses con tasa del 28%"
- "Compara las tarjetas de crédito sin costo anual"
- "¿Qué necesito para solicitar un préstamo hipotecario?"
- "Dame consejos para mejorar mi score crediticio"

## Variables de Entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `FINASHOPPING_API_URL` | `https://finashopping-backend-production.up.railway.app` | URL del backend API |

## Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build
npm run build

# Tests
npm test

# Type check
npm run type-check
```

## Instituciones Soportadas

### Bancos
- BROU (Banco República)
- Santander Uruguay
- Itaú Uruguay
- Scotiabank Uruguay
- BBVA Uruguay

### Seguros
- BSE (Banco de Seguros del Estado)
- Sura Uruguay
- Mapfre Uruguay

### Redes de Pago
- OCA
- Visa
- Mastercard

## Troubleshooting

### El server no aparece en Claude Desktop

1. Verifica que el archivo `claude_desktop_config.json` esté en la ubicación correcta
2. Reinicia Claude Desktop completamente
3. Verifica que Node.js 20+ esté instalado

### Error de conexión al backend

1. Verifica conectividad a internet
2. El backend está en: `https://finashopping-backend-production.up.railway.app/health`

### Ver logs del MCP Server

Los logs se escriben a stderr. En desarrollo puedes verlos en la terminal.

## Licencia

MIT

## Links

- [FinaShopping Web](https://finashopping-frontend.vercel.app)
- [Backend API](https://finashopping-backend-production.up.railway.app/api-docs)
- [MCP Protocol](https://modelcontextprotocol.io)
