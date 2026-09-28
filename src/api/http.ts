import { ApiError } from '../lib/format.ts'
import type { ProblemDetails } from '../types/auth.ts'

function resolveUrl(path: string) {
  if (import.meta.env.DEV) {
    return path
  }
  const base = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
  return `${base}${path}`
}

const AUTH_PATHS = [
  '/api/v1/Auth/login',
  '/api/v1/Auth/first-access',
  '/api/v1/Auth/select-company',
  '/api/v1/Auth/refresh-token',
  '/api/v1/Auth/revoke-token',
]

function isAuthPath(path: string) {
  return AUTH_PATHS.some((item) => path.startsWith(item))
}

async function parseBody(response: Response) {
  if (response.status === 204) {
    return null
  }
  const text = await response.text()
  if (!text) {
    return null
  }
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

async function throwIfFailed(response: Response, body: unknown) {
  if (response.ok) {
    return
  }
  const problem = (body ?? {}) as ProblemDetails
  throw new ApiError(
    response.status,
    problem.title ?? undefined,
    problem.detail ?? (typeof body === 'string' ? body : undefined),
  )
}

export interface RequestOptions {
  method?: string
  body?: unknown
  auth?: boolean
  retry?: boolean
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  const { authStore } = await import('../auth/auth-store.ts')
  const session = authStore.session
  if (options.auth !== false && session?.accessToken) {
    headers.Authorization = `${session.tokenType || 'Bearer'} ${session.accessToken}`
  }

  const response = await fetch(resolveUrl(path), {
    method: options.method ?? 'GET',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })

  const shouldRefresh =
    response.status === 401 &&
    options.retry !== false &&
    options.auth !== false &&
    !isAuthPath(path)

  if (shouldRefresh) {
    const refreshed = await authStore.refresh()
    if (refreshed) {
      return apiRequest<T>(path, { ...options, retry: false })
    }
    authStore.clear()
  }

  const body = await parseBody(response)
  await throwIfFailed(response, body)
  return body as T
}
