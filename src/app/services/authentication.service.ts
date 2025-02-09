import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public username:any;
  public roles:any;
  public users:any=({
    'admin':['USER','ADMIN'],
    'user1':['USER']
  })
  public authenticated:boolean=false;

  constructor(private router:Router) { }

  public login(username:string,password:string){
    if(this.users[username] && password=="1234"){
      this.username=username;
      this.roles=this.users[username];
      this.authenticated=true;
      return true;
    }else{
      return false;
    }
  }

  public logout(){
    this.authenticated=false;
    this.username=undefined;
    this.roles=undefined;
    this.router.navigateByUrl("/login");
  }
}
