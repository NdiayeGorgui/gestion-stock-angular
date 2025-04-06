import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-admin',
  standalone: false,
  
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{

  drawerMode: 'side' | 'over' = 'side';
  drawerOpened = true;
  
  
  constructor(public authService:AuthenticationService,private breakpointObserver: BreakpointObserver){

    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
    .subscribe(result => {
      if (result.matches) {
        this.drawerMode = 'over';
        this.drawerOpened = false;
      } else {
        this.drawerMode = 'side';
        this.drawerOpened = true;
      }
    });
}

toggleDrawer(drawer: any) {
  drawer.toggle();
}
  ngOnInit(): void {
    
  }

  logout(){
    this.authService.logout();
  }

}
