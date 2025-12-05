/**
 * Test data embedded in MCP Server
 * This matches the backend API response format
 */

export const loans = [
  {
    id: 1,
    name: 'Préstamo Personal BROU',
    institution: 'Banco República Oriental del Uruguay (BROU)',
    amount: 150000,
    currency: '$U' as const,
    rate: 28,
    term: 36,
    monthlyPayment: 5850,
    probability: 'alta' as const,
    features: [
      'Sin comisiones de apertura',
      'Aprobación en 48 horas',
      'Tasa fija'
    ]
  },
  {
    id: 2,
    name: 'Préstamo Auto Santander',
    institution: 'Santander Uruguay',
    amount: 800000,
    currency: '$U' as const,
    rate: 32,
    term: 60,
    monthlyPayment: 22400,
    probability: 'media' as const,
    features: [
      'Para vehículos 0km y usados',
      'Hasta 70% de financiación',
      'Seguro incluido'
    ]
  },
  {
    id: 3,
    name: 'Préstamo Hipotecario Itaú',
    institution: 'Itaú Uruguay',
    amount: 3000000,
    currency: 'USD' as const,
    rate: 8.5,
    term: 240,
    monthlyPayment: 25650,
    probability: 'baja' as const,
    features: [
      'Hasta 80% del valor del inmueble',
      'Tasa en dólares',
      'Plazo hasta 20 años'
    ]
  },
  {
    id: 4,
    name: 'Préstamo Personal Scotiabank',
    institution: 'Scotiabank Uruguay',
    amount: 200000,
    currency: '$U' as const,
    rate: 30,
    term: 48,
    monthlyPayment: 6200,
    probability: 'alta' as const,
    features: [
      'Respuesta en 24 horas',
      'Sin garantía requerida',
      'Débito automático'
    ]
  },
  {
    id: 5,
    name: 'Préstamo Auto BBVA',
    institution: 'BBVA Uruguay',
    amount: 600000,
    currency: '$U' as const,
    rate: 29,
    term: 48,
    monthlyPayment: 17500,
    probability: 'media' as const,
    features: [
      'Financiación hasta 80%',
      'Seguro contra robo incluido',
      'Tasa competitiva'
    ]
  }
];

export const creditCards = [
  {
    id: 1,
    name: 'OCA Blue',
    issuer: 'Banco República (BROU)',
    network: 'OCA' as const,
    limit: 100000,
    currency: '$U' as const,
    annualFee: 0,
    benefits: [
      'Sin costo anual',
      'Compras en 12 cuotas sin recargo',
      'Descuentos en comercios adheridos'
    ],
    recommendation: 'Ideal para compras locales'
  },
  {
    id: 2,
    name: 'Santander Mastercard Platinum',
    issuer: 'Santander Uruguay',
    network: 'Mastercard' as const,
    limit: 250000,
    currency: '$U' as const,
    annualFee: 2500,
    benefits: [
      'Acceso a salas VIP en aeropuertos',
      'Seguro de viaje incluido',
      'Cashback 2% en compras internacionales'
    ],
    recommendation: 'Perfecta para viajeros frecuentes'
  },
  {
    id: 3,
    name: 'Itaú Uniclass Infinite',
    issuer: 'Itaú Uruguay',
    network: 'Visa' as const,
    limit: 500000,
    currency: 'USD' as const,
    annualFee: 150,
    benefits: [
      'Programa de millas Lifemiles',
      'Concierge 24/7',
      'Seguro de compras y viajes premium'
    ],
    recommendation: 'Premium para alto poder adquisitivo'
  },
  {
    id: 4,
    name: 'Scotiabank Visa Gold',
    issuer: 'Scotiabank Uruguay',
    network: 'Visa' as const,
    limit: 180000,
    currency: '$U' as const,
    annualFee: 1800,
    benefits: [
      'Programa Scotia Puntos',
      'Seguro de compras',
      'Asistencia en viajes'
    ],
    recommendation: 'Buena relación costo-beneficio'
  }
];

export const insurances = [
  {
    id: 1,
    type: 'Seguro de Vida',
    provider: 'BSE - Banco de Seguros del Estado',
    coverage: 'Hasta $U 2,000,000',
    monthlyPremium: 1500,
    features: [
      'Cobertura por muerte e invalidez',
      'Sin examen médico hasta $U 1,000,000',
      'Beneficiarios flexibles'
    ]
  },
  {
    id: 2,
    type: 'Seguro de Auto',
    provider: 'Sura Uruguay',
    coverage: 'Todo riesgo con franquicia',
    monthlyPremium: 3800,
    features: [
      'Cobertura en todo el territorio nacional',
      'Asistencia 24/7',
      'Auto sustituto en caso de siniestro'
    ]
  },
  {
    id: 3,
    type: 'Seguro de Hogar',
    provider: 'Mapfre Uruguay',
    coverage: 'Hasta USD 100,000',
    monthlyPremium: 2200,
    features: [
      'Cobertura por incendio, robo y daños',
      'Responsabilidad civil incluida',
      'Asistencia del hogar 24/7'
    ]
  }
];

export const guarantees = [
  {
    id: 1,
    type: 'Garantía de Alquiler',
    provider: 'Contaduría General de la Nación',
    coverage: 'Garantía estatal para alquileres',
    requirements: [
      'Ser funcionario público',
      'Presentar últimos recibos de sueldo',
      'No superar cierto porcentaje del ingreso'
    ],
    monthlyFee: 0,
    description: 'Sistema de garantías para funcionarios públicos'
  },
  {
    id: 2,
    type: 'Seguro de Caución',
    provider: 'Sura - Seguro de Caución',
    coverage: 'Hasta 24 meses de alquiler',
    requirements: [
      'Demostrar ingresos estables',
      'Clearing bancario',
      'Pago único anual'
    ],
    monthlyFee: 0,
    annualFee: 8500,
    description: 'Alternativa a la garantía tradicional, sin inmovilizar capital'
  }
];

export const benefits = [
  {
    id: 1,
    title: 'Descuentos en Supermercados',
    description: '15% off en Tienda Inglesa, Disco y Devoto',
    discount: '15%',
    category: 'Alimentación',
    validUntil: '2025-12-31'
  },
  {
    id: 2,
    title: 'Cine con descuento',
    description: '2x1 en Movie Center todos los martes',
    discount: '50%',
    category: 'Entretenimiento',
    validUntil: '2025-12-31'
  },
  {
    id: 3,
    title: 'Descuentos en UTE, OSE y Antel',
    description: '5% de descuento en servicios públicos',
    discount: '5%',
    category: 'Servicios',
    validUntil: '2025-12-31'
  },
  {
    id: 4,
    title: 'Nafta con descuento',
    description: '10% off en Ancap y Petrobras',
    discount: '10%',
    category: 'Combustible',
    validUntil: '2025-12-31'
  }
];

export const institutions = {
  banks: [
    { name: 'BROU', fullName: 'Banco República Oriental del Uruguay', type: 'public' as const },
    { name: 'Santander', fullName: 'Santander Uruguay', type: 'private' as const },
    { name: 'Itaú', fullName: 'Itaú Uruguay', type: 'private' as const },
    { name: 'Scotiabank', fullName: 'Scotiabank Uruguay', type: 'private' as const },
    { name: 'BBVA', fullName: 'BBVA Uruguay', type: 'private' as const }
  ],
  insurers: [
    { name: 'BSE', fullName: 'Banco de Seguros del Estado', type: 'public' as const },
    { name: 'Sura', fullName: 'Sura Uruguay', type: 'private' as const },
    { name: 'Mapfre', fullName: 'Mapfre Uruguay', type: 'private' as const }
  ],
  networks: ['OCA', 'Visa', 'Mastercard']
};

export const creditScoreRanges = [
  { min: 800, max: 850, rating: 'Excelente', color: 'green' },
  { min: 740, max: 799, rating: 'Muy Bueno', color: 'lightgreen' },
  { min: 670, max: 739, rating: 'Bueno', color: 'yellow' },
  { min: 580, max: 669, rating: 'Regular', color: 'orange' },
  { min: 300, max: 579, rating: 'Malo', color: 'red' }
];
