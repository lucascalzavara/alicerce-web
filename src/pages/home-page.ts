import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { layoutStyles } from '../styles/shared.ts'
import '../components/site-header.ts'
import '../components/site-footer.ts'

@customElement('home-page')
export class HomePage extends LitElement {
  firstUpdated() {
    const id = window.location.hash.replace('#', '')
    if (id) {
      this.renderRoot.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  render() {
    return html`
      <div class="page">
        <site-header></site-header>
        <main>
          <section class="hero wrap">
            <div>
              <p class="eyebrow">Plataforma para construção civil</p>
              <h1>O alicerce digital da sua obra.</h1>
              <p class="lead">
                Centralize cronograma, equipe, custos e o andamento do canteiro em um único lugar —
                com acesso por empresa e autenticação segura.
              </p>
              <div class="ctas">
                <a class="primary" href="/first-access">Criar minha empresa</a>
                <a class="secondary" href="/login">Já tenho conta</a>
              </div>
            </div>
            <img src="/logo.svg" alt="Símbolo Alicerce" />
          </section>

          <section id="recursos" class="wrap cards">
            <article>
              <h2>Obra visível</h2>
              <p>Acompanhe o avanço físico e os marcos do projeto sem planilhas espalhadas.</p>
            </article>
            <article>
              <h2>Multiempresa</h2>
              <p>Um usuário pode atuar em várias empresas e escolher o contexto após o login.</p>
            </article>
            <article>
              <h2>Acesso seguro</h2>
              <p>Sessão com JWT: access token de 1 hora e refresh token com 15 dias, com rotação.</p>
            </article>
          </section>

          <section id="como-funciona" class="wrap steps">
            <h2>Como começar</h2>
            <ol>
              <li>Cadastre a empresa e o administrador no primeiro acesso.</li>
              <li>Entre com e-mail e senha. Se houver mais de uma empresa, escolha o contexto.</li>
              <li>Gerencie as obras com a sessão renovada automaticamente em segundo plano.</li>
            </ol>
          </section>
        </main>
        <site-footer></site-footer>
      </div>
    `
  }

  static styles = [
    layoutStyles,
    css`
      .hero {
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        gap: 40px;
        align-items: center;
        padding: 36px 0 56px;
      }

      h1 {
        font-family: var(--font-display);
        font-size: clamp(2.2rem, 5vw, 4rem);
        line-height: 1.05;
        margin: 8px 0 16px;
      }

      .eyebrow {
        margin: 0;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--orange-dark);
        font-weight: 700;
        font-size: 0.78rem;
      }

      .lead {
        font-size: 1.15rem;
        color: var(--ink-soft);
        max-width: 48ch;
      }

      .hero img {
        width: min(420px, 100%);
        margin: 0 auto;
        display: block;
      }

      .ctas {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        margin-top: 24px;
      }

      .primary,
      .secondary {
        display: inline-flex;
        align-items: center;
        padding: 12px 18px;
        border-radius: 999px;
        font-weight: 700;
      }

      .primary {
        background: var(--orange);
        color: #fff;
      }

      .secondary {
        border: 1px solid var(--line);
        background: #fff;
      }

      .cards {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        padding-bottom: 48px;
      }

      article,
      .steps {
        background: var(--paper);
        border: 1px solid var(--line);
        border-radius: 18px;
        padding: 22px;
      }

      article h2,
      .steps h2 {
        font-family: var(--font-display);
        margin: 0 0 8px;
      }

      article p,
      .steps li {
        color: var(--ink-soft);
        margin: 0;
      }

      .steps {
        margin-bottom: 56px;
      }

      ol {
        margin: 12px 0 0;
        padding-left: 18px;
        display: grid;
        gap: 10px;
      }

      @media (max-width: 860px) {
        .hero,
        .cards {
          grid-template-columns: 1fr;
        }
      }
    `,
  ]
}

declare global {
  interface HTMLElementTagNameMap {
    'home-page': HomePage
  }
}
