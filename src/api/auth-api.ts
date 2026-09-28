import { apiRequest } from './http.ts'
import type {
  AuthTokenResponse,
  FirstAccessRequest,
  FirstAccessResponse,
  LoginRequest,
  LoginResponse,
  SelectCompanyRequest,
} from '../types/auth.ts'

export const authApi = {
  login(payload: LoginRequest) {
    return apiRequest<LoginResponse>('/api/v1/Auth/login', {
      method: 'POST',
      body: payload,
      auth: false,
    })
  },

  firstAccess(payload: FirstAccessRequest) {
    return apiRequest<FirstAccessResponse>('/api/v1/Auth/first-access', {
      method: 'POST',
      body: payload,
      auth: false,
    })
  },

  selectCompany(payload: SelectCompanyRequest) {
    return apiRequest<AuthTokenResponse>('/api/v1/Auth/select-company', {
      method: 'POST',
      body: payload,
      auth: false,
    })
  },

  refreshToken(refreshToken: string) {
    return apiRequest<AuthTokenResponse>('/api/v1/Auth/refresh-token', {
      method: 'POST',
      body: { refreshToken },
      auth: false,
      retry: false,
    })
  },

  revokeToken(refreshToken: string) {
    return apiRequest<void>('/api/v1/Auth/revoke-token', {
      method: 'POST',
      body: { refreshToken },
      auth: false,
      retry: false,
    })
  },
}
