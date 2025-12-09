/**
 * TypeScript types for FinaShopping Backend API responses
 * These match the structure returned by the backend endpoints
 */

// === Loans ===

export interface Loan {
  id: number;
  name: string;
  institution: string;
  amount: number;
  currency: '$U' | 'USD';
  rate: number;
  term: number;
  monthlyPayment: number;
  probability: 'alta' | 'media' | 'baja';
  features: string[];
}

export interface LoansResponse {
  loans: Loan[];
}

// === Credit Cards ===

export interface CreditCard {
  id: number;
  name: string;
  issuer: string;
  network: 'OCA' | 'Visa' | 'Mastercard';
  limit: number;
  currency: '$U' | 'USD';
  annualFee: number;
  benefits: string[];
  recommendation: string;
}

export interface CreditCardsResponse {
  creditCards: CreditCard[];
}

// === Insurance ===

export interface Insurance {
  id: number;
  type: string;
  provider: string;
  coverage: string;
  monthlyPremium: number;
  features: string[];
}

export interface InsurancesResponse {
  insurances: Insurance[];
}

// === Guarantees ===

export interface Guarantee {
  id: number;
  type: string;
  provider: string;
  coverage: string;
  requirements: string[];
  monthlyFee: number;
  annualFee?: number;
  description: string;
}

export interface GuaranteesResponse {
  guarantees: Guarantee[];
}

// === Benefits ===

export interface Benefit {
  id: number;
  title: string;
  description: string;
  discount: string;
  category: string;
  validUntil: string;
}

export interface BenefitsResponse {
  benefits: Benefit[];
}

// === Credit Profile ===

export interface CreditFactor {
  score: number;
  status: string;
  description?: string;
}

export interface CreditProfile {
  score: number;
  rating: string;
  lastUpdated: string;
  factors: {
    paymentHistory: CreditFactor;
    creditUtilization: CreditFactor;
    accountAge: CreditFactor;
    creditMix: CreditFactor;
    recentInquiries: CreditFactor;
  };
  recommendations: string[];
}

// === Credit Queries ===

export interface CreditQuery {
  id: number;
  company: string;
  date: string;
  type: 'hard' | 'soft';
  reason: string;
  impact: number;
  status: string;
}

export interface CreditQueriesResponse {
  queries: CreditQuery[];
}

// === Chart Data ===

export interface ChartDataPoint {
  month: string;
  score?: number;
  utilization?: number;
}

export interface ChartDataResponse {
  scoreHistory: ChartDataPoint[];
  utilizationHistory: ChartDataPoint[];
}

// === Financial Tools ===

export interface FinancialTool {
  id: number;
  name: string;
  description: string;
  icon: string;
  link: string;
}

export interface FinancialToolsResponse {
  tools: FinancialTool[];
}

// === Health Check ===

export interface HealthResponse {
  status: 'ok' | 'error';
  timestamp: string;
}
