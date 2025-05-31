import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private keycloak: Keycloak;

  constructor() {
    this.keycloak = new Keycloak({
      url: 'http://keycloak:8080/auth',  // ou `/realms` selon ta version
      realm: 'stock-realm',
      clientId: 'app-stock',
    });
  }

  init(): Promise<boolean> {
    return this.keycloak.init({
      onLoad: 'login-required',
      checkLoginIframe: false,
    });
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }

  logout() {
    this.keycloak.logout();
  }

  getUsername(): string {
    return this.keycloak.tokenParsed?.['preferred_username'] ?? '';
  }

  isAuthenticated(): boolean {
    return !!this.keycloak.token;
  }
}
