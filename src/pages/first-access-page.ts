import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { authApi } from '../api/auth-api.ts'
import { authStore } from '../auth/auth-store.ts'
import { formatPhone, formatTaxId, problemMessage } from '../lib/format.ts'
import { navigate } from '../lib/navigate.ts'
import { formStyles } from '../styles/shared.ts'

@customElement('first-access-page')
export class FirstAccessPage extends LitElement {
  @state() private companyName = ''
  @state() private taxId = ''
  @state() private phone = ''
  @state() private address = ''
  @state() private adminName = ''
  @state() private adminEmail = ''
  @state() private password = ''
  @state() private confirmPassword = ''
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
    if (this.password !== this.confirmPassword) {
      this.error = 'As senhas não coincidem.'
      return
    }
    if (this.password.length < 6) {
      this.error = 'A senha deve ter pelo menos 6 caracteres.'
      return
    }

    this.loading = true
    try {
      const response = await authApi.firstAccess({
        companyName: this.companyName.trim(),
        taxId: this.taxId.trim() || null,
        address: this.address.trim() || null,
        phone: this.phone.trim() || null,
        adminName: this.adminName.trim(),
        adminEmail: this.adminEmail.trim(),
        password: this.password,
      })
      authStore.applyFirstAccess(response)
      navigate('/app')
    } catch (error) {
      this.error = problemMessage(error, 'Não foi possível concluir o primeiro acesso.')
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
            <h1>Abra a conta da sua empresa.</h1>
            <p>
              O primeiro acesso cria a empresa e o usuário administrador. Em seguida você já entra
              autenticado.
            </p>
          </div>
        </aside>
        <section class="panel">
          <form @submit=${this.onSubmit}>
            <h2>Primeiro acesso</h2>
            <p class="lead">Dados da empresa e do administrador inicial.</p>
            ${this.error ? html`<div class="error">${this.error}</div>` : ''}
            <label>
              Nome da empresa
              <input
                required
                maxlength="255"
                .value=${this.companyName}
                @input=${(e: InputEvent) => (this.companyName = (e.target as HTMLInputElement).value)}
              />
            </label>
            <div class="row">
              <label>
                CNPJ / documento
                <input
                  maxlength="50"
                  .value=${this.taxId}
                  @input=${(e: InputEvent) => {
                    this.taxId = formatTaxId((e.target as HTMLInputElement).value)
                  }}
                />
              </label>
              <label>
                Telefone
                <input
                  maxlength="50"
                  .value=${this.phone}
                  @input=${(e: InputEvent) => {
                    this.phone = formatPhone((e.target as HTMLInputElement).value)
                  }}
                />
              </label>
            </div>
            <label>
              Endereço
              <input
                maxlength="500"
                .value=${this.address}
                @input=${(e: InputEvent) => (this.address = (e.target as HTMLInputElement).value)}
              />
            </label>
            <label>
              Nome do administrador
              <input
                required
                maxlength="255"
                .value=${this.adminName}
                @input=${(e: InputEvent) => (this.adminName = (e.target as HTMLInputElement).value)}
              />
            </label>
            <label>
              E-mail do administrador
              <input
                type="email"
                required
                maxlength="255"
                .value=${this.adminEmail}
                @input=${(e: InputEvent) => (this.adminEmail = (e.target as HTMLInputElement).value)}
              />
            </label>
            <div class="row">
              <label>
                Senha
                <input
                  type="password"
                  required
                  minlength="6"
                  .value=${this.password}
                  @input=${(e: InputEvent) => (this.password = (e.target as HTMLInputElement).value)}
                />
              </label>
              <label>
                Confirmar senha
                <input
                  type="password"
                  required
                  minlength="6"
                  .value=${this.confirmPassword}
                  @input=${(e: InputEvent) =>
                    (this.confirmPassword = (e.target as HTMLInputElement).value)}
                />
              </label>
            </div>
            <div class="actions">
              <button type="submit" ?disabled=${this.loading}>
                ${this.loading ? 'Criando...' : 'Criar empresa e entrar'}
              </button>
              <a class="ghost" href="/login">Já tenho uma conta</a>
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
    'first-access-page': FirstAccessPage
  }
}
