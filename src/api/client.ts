/**
 * FinaShopping Backend API Client
 *
 * HTTP client for connecting to the FinaShopping backend API.
 * Uses axios with JWT authentication and automatic token refresh.
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type {
  LoansResponse,
  CreditCardsResponse,
  InsurancesResponse,
  GuaranteesResponse,
  BenefitsResponse,
  CreditProfile,
  CreditQueriesResponse,
  ChartDataResponse,
  FinancialToolsResponse,
  HealthResponse
} from './types.js';

// API URL configuration
const API_URL = process.env.FINASHOPPING_API_URL ||
  'https://finashopping-backend-production.up.railway.app';

// Service account credentials (from environment)
const SERVICE_USERNAME = process.env.FINASHOPPING_SERVICE_USERNAME;
const SERVICE_PASSWORD = process.env.FINASHOPPING_SERVICE_PASSWORD;

// Token storage
let accessToken: string | null = null;
let tokenExpiresAt: number = 0;

/**
 * Login response type
 */
interface LoginResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    name: string;
    email: string;
  };
}

/**
 * Axios client instance configured for FinaShopping API
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Authenticate with the backend API using service credentials
 */
async function authenticate(): Promise<void> {
  if (!SERVICE_USERNAME || !SERVICE_PASSWORD) {
    throw new Error(
      'Credenciales de servicio no configuradas. ' +
      'Configure FINASHOPPING_SERVICE_USERNAME y FINASHOPPING_SERVICE_PASSWORD.'
    );
  }

  try {
    const response = await axios.post<LoginResponse>(
      `${API_URL}/auth/v1/login`,
      {
        username: SERVICE_USERNAME,
        password: SERVICE_PASSWORD,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.success) {
      accessToken = response.data.token;
      // Token expires in 15 minutes, refresh 1 minute before
      tokenExpiresAt = Date.now() + 14 * 60 * 1000;
      console.log('[FinaShopping API] Authenticated successfully');
    } else {
      throw new Error('Login failed');
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message = axiosError.response?.data?.message || axiosError.message;
    throw new Error(`Error de autenticación: ${message}`);
  }
}

/**
 * Ensure we have a valid token before making requests
 */
async function ensureAuthenticated(): Promise<string> {
  // Check if token is expired or about to expire
  if (!accessToken || Date.now() >= tokenExpiresAt) {
    await authenticate();
  }
  return accessToken!;
}

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Skip auth for health endpoint
    if (config.url === '/health') {
      return config;
    }

    const token = await ensureAuthenticated();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url;

    // If 401, try to re-authenticate once
    if (status === 401 && error.config && !error.config.headers['X-Retry']) {
      console.warn('[FinaShopping API] Token expired, re-authenticating...');
      accessToken = null;
      tokenExpiresAt = 0;

      try {
        const token = await ensureAuthenticated();
        error.config.headers.Authorization = `Bearer ${token}`;
        error.config.headers['X-Retry'] = 'true';
        return apiClient.request(error.config);
      } catch (authError) {
        console.error('[FinaShopping API] Re-authentication failed');
        throw authError;
      }
    }

    if (error.code === 'ECONNABORTED') {
      console.error(`[FinaShopping API] Timeout on ${url}`);
    } else if (error.code === 'ECONNREFUSED') {
      console.error(`[FinaShopping API] Connection refused to ${API_URL}`);
    } else if (status) {
      console.error(`[FinaShopping API] HTTP ${status} on ${url}`);
    } else {
      console.error(`[FinaShopping API] Error: ${error.message}`);
    }

    throw error;
  }
);

// === API Methods ===

/**
 * Check backend health status
 */
export async function checkHealth(): Promise<HealthResponse> {
  const response = await apiClient.get<HealthResponse>('/health');
  return response.data;
}

/**
 * Fetch all loans from the catalog
 */
export async function fetchLoans(): Promise<LoansResponse> {
  const response = await apiClient.get<LoansResponse>('/api/v1/loans');
  return response.data;
}

/**
 * Fetch all credit cards from the catalog
 */
export async function fetchCreditCards(): Promise<CreditCardsResponse> {
  const response = await apiClient.get<CreditCardsResponse>('/api/v1/credit-cards');
  return response.data;
}

/**
 * Fetch all insurance products
 */
export async function fetchInsurances(): Promise<InsurancesResponse> {
  const response = await apiClient.get<InsurancesResponse>('/api/v1/insurances');
  return response.data;
}

/**
 * Fetch all rental guarantees
 */
export async function fetchGuarantees(): Promise<GuaranteesResponse> {
  const response = await apiClient.get<GuaranteesResponse>('/api/v1/guarantees');
  return response.data;
}

/**
 * Fetch benefits and discounts
 */
export async function fetchBenefits(): Promise<BenefitsResponse> {
  const response = await apiClient.get<BenefitsResponse>('/api/v1/benefits');
  return response.data;
}

/**
 * Fetch user's credit profile
 * Note: This endpoint returns mock data for unauthenticated requests
 */
export async function fetchCreditProfile(): Promise<CreditProfile> {
  const response = await apiClient.get<CreditProfile>('/api/v1/credit-profile');
  return response.data;
}

/**
 * Fetch credit inquiry history
 * Note: This endpoint returns mock data for unauthenticated requests
 */
export async function fetchCreditQueries(): Promise<CreditQueriesResponse> {
  const response = await apiClient.get<CreditQueriesResponse>('/api/v1/credit-queries');
  return response.data;
}

/**
 * Fetch chart data for credit score history
 * Note: This endpoint returns mock data for unauthenticated requests
 */
export async function fetchChartData(): Promise<ChartDataResponse> {
  const response = await apiClient.get<ChartDataResponse>('/api/v1/chart-data');
  return response.data;
}

/**
 * Fetch available financial tools
 */
export async function fetchFinancialTools(): Promise<FinancialToolsResponse> {
  const response = await apiClient.get<FinancialToolsResponse>('/api/v1/financial-tools');
  return response.data;
}

/**
 * Get the configured API base URL
 */
export function getApiUrl(): string {
  return API_URL;
}
