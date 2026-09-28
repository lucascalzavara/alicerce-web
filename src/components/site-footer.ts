import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('site-footer')
export class SiteFooter extends LitElement {
  render() {
    return html`
      <footer>
        <img src="/logo-with-name.svg" alt="" />
        <p>Alicerce · Gerenciamento de Obras</p>
      </footer>
    `
  }

  static styles = css`
    footer {
      border-top: 1px solid var(--line);
      padding: 28px 20px 40px;
      display: grid;
      justify-items: center;
      gap: 8px;
      color: var(--ink-soft);
    }

    img {
      height: 72px;
      width: auto;
    }

    p {
      margin: 0;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      font-size: 0.75rem;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'site-footer': SiteFooter
  }
}
