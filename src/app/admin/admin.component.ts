import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDrawer } from '@angular/material/sidenav';

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


  constructor(
    public authService: AuthenticationService,
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
  ngOnInit(): void {

  }

  logout() {
    this.authService.logout();
  }

  closeDrawerIfMobile(drawer: MatDrawer): void {
    if (this.isSmallScreen) {
      drawer.close();
    }
  }


}
