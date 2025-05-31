import { Component, OnInit } from '@angular/core';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDrawer } from '@angular/material/sidenav';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-admin',
  standalone: false,

  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {

  drawerMode: 'side' | 'over' = 'side';
  drawerOpened = true;
  isSmallScreen = false;

  firstName: string = '';


  constructor(private keycloakService: KeycloakService,
    
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(result => {
        if (result.matches) {
          this.drawerMode = 'over';
          this.drawerOpened = false;
          this.isSmallScreen = true;
        } else {
          this.drawerMode = 'side';
          this.drawerOpened = true;
          this.isSmallScreen = false;
        }
      });
  }


  toggleDrawer(drawer: any) {
    drawer.toggle();
  }
  async ngOnInit(): Promise<void> {
     const profile = await this.keycloakService.loadUserProfile();
    this.firstName = profile.firstName || '';

  }

 logout(): void {
    this.keycloakService.logout(window.location.origin); // Redirige vers la page d'accueil
  }

  get username(): string {
    return this.keycloakService.getKeycloakInstance().tokenParsed?.['preferred_username'] || '';
  }

  closeDrawerIfMobile(drawer: MatDrawer): void {
    if (this.isSmallScreen) {
      drawer.close();
    }
  }


}
