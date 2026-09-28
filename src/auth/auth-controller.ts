import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { authStore } from './auth-store.ts'

export class AuthController implements ReactiveController {
  constructor(private host: ReactiveControllerHost) {
    host.addController(this)
  }

  get session() {
    return authStore.session
  }

  get isAuthenticated() {
    return authStore.isAuthenticated
  }

  hostConnected() {
    this.unsubscribe = authStore.subscribe(() => this.host.requestUpdate())
  }

  hostDisconnected() {
    this.unsubscribe?.()
  }

  private unsubscribe?: () => boolean
}
