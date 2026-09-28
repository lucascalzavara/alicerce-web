import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { authApi } from '../api/auth-api.ts'
import { authStore } from '../auth/auth-store.ts'
import { ApiError, problemMessage } from '../lib/format.ts'
import { navigate } from '../lib/navigate.ts'
import { formStyles } from '../styles/shared.ts'
import type { CompanyOptionDto } from '../types/auth.ts'

@customElement('select-company-page')
export class SelectCompanyPage extends LitElement {
  @state() private error = ''
  @state() private loading = false
  @state() private selectedId = ''

  connectedCallback() {
    super.connectedCallback()
    if (authStore.isAuthenticated) {
      navigate('/app')
      return
    }
    if (!authStore.selection) {
      navigate('/login')
    }
  }

  private async choose(company: CompanyOptionDto) {
    const selection = authStore.selection
    if (!selection) {
      navigate('/login')
      return
    }
    this.selectedId = company.id
    this.loading = true
    this.error = ''
    try {
      const tokens = await authApi.selectCompany({
        companyId: company.id,
        selectionToken: selection.selectionToken,
      })
      authStore.applyAuth(tokens)
      navigate('/app')
    } catch (error) {
      this.error = problemMessage(error, 'Não foi possível selecionar a empresa. Entre novamente.')
      if (error instanceof ApiError && error.status === 401) {
        authStore.clearSelection()
        navigate('/login')
      }
    } finally {
      this.loading = false
    }
  }

  render() {
    const selection = authStore.selection
    const companies = selection?.companies ?? []

    return html`
      <div class="auth-shell">
        <aside class="aside">
          <a href="/"><img src="/logo-with-name.svg" alt="Alicerce" /></a>
          <div>
            <h1>Escolha a empresa do contexto.</h1>
            <p>
              Esta etapa vale por 5 minutos. Depois da escolha, emitimos o access token (1h) e o
              refresh token (15 dias).
            </p>
          </div>
        </aside>
        <section class="panel">
          <div class="card">
            <h2>Selecionar empresa</h2>
            <p class="lead">
              ${selection?.email
                ? html`Conta <strong>${selection.email}</strong>. Escolha onde deseja entrar.`
                : 'Escolha a empresa para concluir o login.'}
            </p>
            ${this.error ? html`<div class="error">${this.error}</div>` : ''}
            <div class="companies">
              ${companies.map(
                (company) => html`
                  <button
                    class="company"
                    type="button"
                    ?disabled=${this.loading}
                    aria-pressed=${this.selectedId === company.id}
                    @click=${() => this.choose(company)}
                  >
                    <strong>${company.name || 'Empresa sem nome'}</strong>
                    <span>${company.taxId || 'Documento não informado'}</span>
                  </button>
                `,
              )}
            </div>
            <a class="ghost" href="/login">Voltar ao login</a>
          </div>
        </section>
      </div>
    `
  }

  static styles = formStyles
}

declare global {
  interface HTMLElementTagNameMap {
    'select-company-page': SelectCompanyPage
  }
}
