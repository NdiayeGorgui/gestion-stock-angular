import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-admin',
  standalone: false,
  
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  constructor(public authService:AuthenticationService){

  }
  ngOnInit(): void {
    
  }

  logout(){
    this.authService.logout();
  }

}
