import { authApi } from '../api/auth-api.ts'
import type {
  AuthSession,
  AuthTokenResponse,
  CompanySelectionState,
  FirstAccessResponse,
  UserInfoDto,
} from '../types/auth.ts'

const SESSION_KEY = 'alicerce.auth.session'
const SELECTION_KEY = 'alicerce.auth.selection'

type Listener = () => void

function toExpiresAt(expiresIn: number, expiresAt?: string) {
  if (expiresAt) {
    const parsed = Date.parse(expiresAt)
    if (!Number.isNaN(parsed)) {
      return parsed
    }
  }
  const seconds = expiresIn > 0 ? expiresIn : 3600
  return Date.now() + seconds * 1000
}

function sessionFromTokens(
  tokens: AuthTokenResponse,
  fallbackUser?: UserInfoDto | null,
): AuthSession | null {
  if (!tokens.accessToken || !tokens.refreshToken) {
    return null
  }
  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    tokenType: tokens.tokenType || 'Bearer',
    expiresAt: toExpiresAt(tokens.expiresIn),
    user: tokens.user ?? fallbackUser ?? null,
    company: tokens.company ?? null,
  }
}

function sessionFromFirstAccess(response: FirstAccessResponse): AuthSession | null {
  if (!response.accessToken || !response.refreshToken) {
    return null
  }
  return {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    tokenType: response.tokenType || 'Bearer',
    expiresAt: toExpiresAt(response.expiresIn, response.expiresAt),
    user: {
      id: response.userId,
      name: response.userName,
      email: response.userEmail,
      role: response.role,
    },
    company: {
      id: response.companyId,
      name: response.companyName,
      taxId: response.taxId,
    },
  }
}

function readJson<T>(storage: Storage, key: string): T | null {
  try {
    const raw = storage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

class AuthStore {
  session: AuthSession | null = readJson<AuthSession>(localStorage, SESSION_KEY)
  selection: CompanySelectionState | null = readJson<CompanySelectionState>(
    sessionStorage,
    SELECTION_KEY,
  )
  private listeners = new Set<Listener>()
  private refreshPromise: Promise<boolean> | null = null
  private refreshTimer = 0

  constructor() {
    this.scheduleRefresh()
  }

  get isAuthenticated() {
    return Boolean(this.session?.accessToken && this.session?.refreshToken)
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private emit() {
    for (const listener of this.listeners) {
      listener()
    }
  }

  private persist() {
    if (this.session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(this.session))
    } else {
      localStorage.removeItem(SESSION_KEY)
    }
    if (this.selection) {
      sessionStorage.setItem(SELECTION_KEY, JSON.stringify(this.selection))
    } else {
      sessionStorage.removeItem(SELECTION_KEY)
    }
    this.scheduleRefresh()
    this.emit()
  }

  applyAuth(tokens: AuthTokenResponse) {
    const next = sessionFromTokens(tokens, this.session?.user)
    if (!next) {
      throw new Error('A API não retornou os tokens de autenticação.')
    }
    this.session = next
    this.selection = null
    this.persist()
  }

  applyFirstAccess(response: FirstAccessResponse) {
    const next = sessionFromFirstAccess(response)
    if (!next) {
      throw new Error('A API não retornou os tokens de autenticação.')
    }
    this.session = next
    this.selection = null
    this.persist()
  }

  setSelection(selection: CompanySelectionState) {
    this.selection = selection
    this.persist()
  }

  clearSelection() {
    this.selection = null
    this.persist()
  }

  clear() {
    this.session = null
    this.selection = null
    this.persist()
  }

  async refresh() {
    if (!this.session?.refreshToken) {
      return false
    }
    if (!this.refreshPromise) {
      this.refreshPromise = this.runRefresh().finally(() => {
        this.refreshPromise = null
      })
    }
    return this.refreshPromise
  }

  private async runRefresh() {
    const current = this.session
    if (!current?.refreshToken) {
      return false
    }
    try {
      const tokens = await authApi.refreshToken(current.refreshToken)
      const next = sessionFromTokens(tokens, current.user)
      if (!next) {
        return false
      }
      this.session = {
        ...next,
        user: next.user ?? current.user,
        company: next.company ?? current.company,
      }
      this.persist()
      return true
    } catch {
      this.clear()
      return false
    }
  }

  async logout() {
    const refreshToken = this.session?.refreshToken
    this.clear()
    if (refreshToken) {
      try {
        await authApi.revokeToken(refreshToken)
      } catch {
        // Keep the local logout even if the API rejects the revocation.
      }
    }
  }

  private scheduleRefresh() {
    window.clearTimeout(this.refreshTimer)
    if (!this.session) {
      return
    }
    const delay = Math.max(this.session.expiresAt - Date.now() - 60_000, 5_000)
    this.refreshTimer = window.setTimeout(() => {
      void this.refresh()
    }, delay)
  }
}

export const authStore = new AuthStore()
