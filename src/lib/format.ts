export function onlyDigits(value: string) {
  return value.replace(/\D/g, '')
}

export function formatTaxId(value: string) {
  const digits = onlyDigits(value).slice(0, 14)
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }
  return digits
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
}

export function formatPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11)
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d{1,4})$/, '$1-$2')
  }
  return digits.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{1,4})$/, '$1-$2')
}

export function problemMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    return error.detail || error.title || fallback
  }
  if (error instanceof Error && error.message) {
    return error.message
  }
  return fallback
}

export class ApiError extends Error {
  status: number
  title?: string
  detail?: string

  constructor(status: number, title?: string, detail?: string) {
    super(detail || title || `Erro ${status}`)
    this.status = status
    this.title = title
    this.detail = detail
  }
}
