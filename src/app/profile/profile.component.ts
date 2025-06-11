import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-profile',
  standalone: false,
  
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  roles: string[] = [];

  constructor(private keycloakService: KeycloakService) {}

  async ngOnInit(): Promise<void> {
    const tokenParsed = this.keycloakService.getKeycloakInstance().tokenParsed;

    this.firstName = tokenParsed?.['given_name'] || '';
    this.lastName = tokenParsed?.['family_name'] || '';
    this.email = tokenParsed?.['email'] || '';
    this.roles = tokenParsed?.realm_access?.roles || [];

    const allRoles: string[] = tokenParsed?.realm_access?.roles || [];
  const excluded = ['default-roles-stock-realm', 'offline_access', 'uma_authorization'];

  this.roles = allRoles.filter(role => !excluded.includes(role));
  }

  manageAccount(): void {
    this.keycloakService.getKeycloakInstance().accountManagement();
  }

}
