import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { authApi } from '../api/auth-api.ts'
import { authStore } from '../auth/auth-store.ts'
import { problemMessage } from '../lib/format.ts'
import { navigate } from '../lib/navigate.ts'
import { formStyles } from '../styles/shared.ts'

@customElement('login-page')
export class LoginPage extends LitElement {
  @state() private email = ''
  @state() private password = ''
  @state() private error = ''
  @state() private loading = false

  connectedCallback() {
    super.connectedCallback()
    if (authStore.isAuthenticated) {
      navigate('/app')
    }
  }

  private async onSubmit(event: Event) {
    event.preventDefault()
    this.error = ''
    this.loading = true
    try {
      const response = await authApi.login({
        email: this.email.trim(),
        password: this.password,
      })

      if (response.requiresCompanySelection) {
        if (!response.selectionToken || !response.availableCompanies?.length) {
          throw new Error('Não foi possível carregar as empresas para seleção.')
        }
        authStore.setSelection({
          selectionToken: response.selectionToken,
          companies: response.availableCompanies,
          email: this.email.trim(),
        })
        navigate('/select-company')
        return
      }

      if (!response.auth) {
        throw new Error('Login concluído sem tokens. Verifique a resposta da API.')
      }
      authStore.applyAuth(response.auth)
      navigate('/app')
    } catch (error) {
      this.error = problemMessage(error, 'Não foi possível entrar. Verifique e-mail e senha.')
    } finally {
      this.loading = false
    }
  }

  render() {
    return html`
      <div class="auth-shell">
        <aside class="aside">
          <a href="/"><img src="/logo-with-name.svg" alt="Alicerce" /></a>
          <div>
            <h1>Entre para acompanhar suas obras.</h1>
            <p>Se você participa de mais de uma empresa, vamos pedir a escolha do contexto em seguida.</p>
          </div>
        </aside>
        <section class="panel">
          <form @submit=${this.onSubmit}>
            <h2>Entrar</h2>
            <p class="lead">Use o e-mail e a senha da sua conta Alicerce.</p>
            ${this.error ? html`<div class="error">${this.error}</div>` : ''}
            <label>
              E-mail
              <input
                type="email"
                required
                autocomplete="username"
                .value=${this.email}
                @input=${(e: InputEvent) => (this.email = (e.target as HTMLInputElement).value)}
              />
            </label>
            <label>
              Senha
              <input
                type="password"
                required
                autocomplete="current-password"
                .value=${this.password}
                @input=${(e: InputEvent) => (this.password = (e.target as HTMLInputElement).value)}
              />
            </label>
            <div class="actions">
              <button type="submit" ?disabled=${this.loading}>
                ${this.loading ? 'Entrando...' : 'Continuar'}
              </button>
              <a class="ghost" href="/first-access">Primeiro acesso da empresa</a>
            </div>
          </form>
        </section>
      </div>
    `
  }

  static styles = formStyles
}

declare global {
  interface HTMLElementTagNameMap {
    'login-page': LoginPage
  }
}
