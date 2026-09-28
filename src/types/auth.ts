export interface CompanyOptionDto {
  id: string
  name?: string | null
  taxId?: string | null
}

export interface UserInfoDto {
  id: string
  name?: string | null
  email?: string | null
  role?: string | null
}

export interface AuthTokenResponse {
  accessToken?: string | null
  refreshToken?: string | null
  tokenType?: string | null
  expiresIn: number
  company?: CompanyOptionDto
  user?: UserInfoDto
}

export interface FirstAccessRequest {
  companyName: string
  taxId?: string | null
  address?: string | null
  phone?: string | null
  adminName: string
  adminEmail: string
  password: string
}

export interface FirstAccessResponse {
  companyId: string
  companyName?: string | null
  taxId?: string | null
  userId: string
  userName?: string | null
  userEmail?: string | null
  role?: string | null
  accessToken?: string | null
  refreshToken?: string | null
  tokenType?: string | null
  expiresIn: number
  expiresAt: string
}

export interface LoginRequest {
  email: string
  password: string
  companyId?: string | null
}

export interface LoginResponse {
  requiresCompanySelection: boolean
  selectionToken?: string | null
  availableCompanies?: CompanyOptionDto[] | null
  auth?: AuthTokenResponse
}

export interface ProblemDetails {
  type?: string | null
  title?: string | null
  status?: number | null
  detail?: string | null
  instance?: string | null
}

export interface SelectCompanyRequest {
  selectionToken: string
  companyId: string
}

export interface AuthSession {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresAt: number
  user: UserInfoDto | null
  company: CompanyOptionDto | null
}

export interface CompanySelectionState {
  selectionToken: string
  companies: CompanyOptionDto[]
  email: string
}
