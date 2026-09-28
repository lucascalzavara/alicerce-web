import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { AuthController } from '../auth/auth-controller.ts'
import { authStore } from '../auth/auth-store.ts'
import { navigate } from '../lib/navigate.ts'
import { layoutStyles } from '../styles/shared.ts'

@customElement('app-home-page')
export class AppHomePage extends LitElement {
  private readonly auth = new AuthController(this)
  @state() private leaving = false

  connectedCallback() {
    super.connectedCallback()
    if (!this.auth.isAuthenticated) {
      navigate('/login')
    }
  }

  private async logout() {
    this.leaving = true
    await authStore.logout()
    navigate('/')
  }

  render() {
    const session = this.auth.session
    return html`
      <div class="page">
        <header>
          <img src="/logo.svg" alt="Alicerce" />
          <div class="who">
            <strong>${session?.user?.name || session?.user?.email || 'Usuário'}</strong>
            <span>${session?.company?.name || 'Empresa'}</span>
          </div>
          <button type="button" ?disabled=${this.leaving} @click=${this.logout}>Sair</button>
        </header>
        <main class="wrap">
          <section>
            <p class="eyebrow">Área autenticada</p>
            <h1>Sessão iniciada.</h1>
            <p>
              O frontend já está pronto para as próximas telas de obra. Access token renovado em
              segundo plano; refresh token com 15 dias e rotação na API.
            </p>
            <dl>
              <div>
                <dt>Perfil</dt>
                <dd>${session?.user?.role || '—'}</dd>
              </div>
              <div>
                <dt>Empresa</dt>
                <dd>${session?.company?.name || '—'}</dd>
              </div>
              <div>
                <dt>Documento</dt>
                <dd>${session?.company?.taxId || '—'}</dd>
              </div>
            </dl>
          </section>
        </main>
      </div>
    `
  }

  static styles = [
    layoutStyles,
    css`
      header {
        display: flex;
        align-items: center;
        gap: 16px;
        width: min(1120px, calc(100% - 40px));
        margin: 0 auto;
        padding: 18px 0;
      }

      img {
        height: 58px;
        width: auto;
      }

      .who {
        display: grid;
        margin-right: auto;
      }

      .who span {
        color: var(--ink-soft);
        font-size: 0.92rem;
      }

      button {
        border: 1px solid var(--line);
        background: #fff;
        border-radius: 999px;
        padding: 8px 14px;
        cursor: pointer;
      }

      section {
        background: var(--paper);
        border: 1px solid var(--line);
        border-radius: 22px;
        padding: 32px;
        margin: 24px 0 48px;
      }

      h1 {
        font-family: var(--font-display);
        margin: 4px 0 12px;
      }

      .eyebrow {
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--orange-dark);
        font-weight: 700;
        font-size: 0.75rem;
        margin: 0;
      }

      dl {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        margin: 28px 0 0;
      }

      dt {
        color: var(--ink-soft);
        font-size: 0.85rem;
      }

      dd {
        margin: 4px 0 0;
        font-weight: 700;
      }

      @media (max-width: 720px) {
        dl {
          grid-template-columns: 1fr;
        }
      }
    `,
  ]
}

declare global {
  interface HTMLElementTagNameMap {
    'app-home-page': AppHomePage
  }
}
