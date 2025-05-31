import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
 constructor(private keycloakService: KeycloakService) {}

  getToken(): Promise<string> {
    return this.keycloakService.getToken();
  }

  isAdmin(): boolean {
    // Récupérer les rôles du realm (realm roles)
    const roles = this.keycloakService.getUserRoles(true); // true pour roles realm (false = client roles)
    return roles.includes('ADMIN');
  }
  
}
