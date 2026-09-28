import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('site-header')
export class SiteHeader extends LitElement {
  render() {
    return html`
      <header>
        <a class="brand" href="/" aria-label="Alicerce — início">
          <img src="/logo-with-name.svg" alt="Alicerce" />
        </a>
        <nav>
          <a href="/#recursos">Recursos</a>
          <a href="/#como-funciona">Como funciona</a>
          <a href="/login">Entrar</a>
          <a class="cta" href="/first-access">Começar</a>
        </nav>
      </header>
    `
  }

  static styles = css`
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      width: min(1120px, calc(100% - 40px));
      margin: 0 auto;
      padding: 18px 0;
    }

    .brand img {
      height: 68px;
      width: auto;
      display: block;
    }

    nav {
      display: flex;
      align-items: center;
      gap: 18px;
      font-weight: 600;
    }

    a {
      color: var(--ink);
      text-decoration: none;
    }

    .cta {
      background: var(--orange);
      color: #fff;
      padding: 10px 16px;
      border-radius: 999px;
    }

    @media (max-width: 720px) {
      header {
        flex-direction: column;
      }

      nav {
        justify-content: center;
        flex-wrap: wrap;
        gap: 10px;
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'site-header': SiteHeader
  }
}
