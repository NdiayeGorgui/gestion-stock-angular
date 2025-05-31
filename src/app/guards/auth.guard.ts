





import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminRoleGuard implements CanActivate {
  constructor(private keycloakService: KeycloakService, private router: Router) {}

  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const roles = this.keycloakService.getUserRoles(true); // true pour roles realm
    const isAdmin = roles.includes('ADMIN');
    if (!isAdmin) {
      // Redirige vers page Forbidden
      return this.router.parseUrl('/admin/forbidden');
    }
    return true;
  }
}
