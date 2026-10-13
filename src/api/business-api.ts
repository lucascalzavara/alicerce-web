import { apiRequest } from './http'
export const businessRequest = <T>(method: string, path: string, body?: unknown, blob = false) => apiRequest<T>(path, { method, body, blob })
