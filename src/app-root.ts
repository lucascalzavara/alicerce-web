import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { isModifiedClick, navigate } from './lib/navigate.ts'
import './pages/home-page.ts'
import './pages/login-page.ts'
import './pages/first-access-page.ts'
import './pages/select-company-page.ts'
import './pages/app-home-page.ts'

@customElement('app-root')
export class AppRoot extends LitElement {
  @state() private path = window.location.pathname

  connectedCallback() {
    super.connectedCallback()
    window.addEventListener('popstate', this.onPopState)
    this.addEventListener('click', this.onClick)
  }

  disconnectedCallback() {
    window.removeEventListener('popstate', this.onPopState)
    this.removeEventListener('click', this.onClick)
    super.disconnectedCallback()
  }

  private onPopState = () => {
    this.path = window.location.pathname
    window.scrollTo(0, 0)
  }

  private onClick = (event: Event) => {
    const mouse = event as MouseEvent
    if (mouse.defaultPrevented || isModifiedClick(mouse)) {
      return
    }
    const anchor = event
      .composedPath()
      .find((node) => node instanceof HTMLAnchorElement) as HTMLAnchorElement | undefined
    if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) {
      return
    }
    const url = new URL(anchor.href, window.location.origin)
    if (url.origin !== window.location.origin) {
      return
    }
    event.preventDefault()
    navigate(`${url.pathname}${url.search}${url.hash}`)
    void this.updateComplete.then(() => this.scrollToHash())
  }

  private scrollToHash() {
    const id = window.location.hash.replace('#', '')
    if (!id) {
      return
    }
    const page = this.querySelector('home-page')
    page?.shadowRoot?.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  private outlet() {
    switch (this.path) {
      case '/login':
        return html`<login-page></login-page>`
      case '/first-access':
        return html`<first-access-page></first-access-page>`
      case '/select-company':
        return html`<select-company-page></select-company-page>`
      case '/app':
        return html`<app-home-page></app-home-page>`
      default:
        return html`<home-page></home-page>`
    }
  }

  createRenderRoot() {
    return this
  }

  render() {
    return this.outlet()
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-root': AppRoot
  }
}
