import { Injectable } from '@angular/core';
import Keycloak, { KeycloakInstance } from 'keycloak-js';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private keycloak: KeycloakInstance;

  constructor() {
    this.keycloak = new Keycloak({
      // 💡 Astuce : si tu utilises `proxy.conf.json`, tu peux remplacer par '/auth'
      url: 'http://keycloak:8080/auth',
      realm: 'stock-realm',
      clientId: 'app-stock',
    });
  }

  init(): Promise<boolean> {
    return this.keycloak
      .init({
        onLoad: 'login-required',
        checkLoginIframe: false,
      })
      .then((authenticated) => {
        console.log('[Keycloak] Authenticated:', authenticated);
        return authenticated;
      })
      .catch((error) => {
        console.error('[Keycloak] Init Error:', error);
        return false;
      });
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }

  logout(): void {
    this.keycloak.logout();
  }

  getUsername(): string {
    return this.keycloak.tokenParsed?.['preferred_username'] ?? '';
  }

  isAuthenticated(): boolean {
    return !!this.keycloak.token;
  }

  getKeycloakInstance(): KeycloakInstance {
    return this.keycloak;
  }
}
