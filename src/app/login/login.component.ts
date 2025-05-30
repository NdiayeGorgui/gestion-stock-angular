import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  public loginFormGroup!:FormGroup;
  constructor(private fb:FormBuilder,private router:Router){

  }
  ngOnInit(): void {
    this.loginFormGroup=this.fb.group({
      username:this.fb.control(''),
      password:this.fb.control('')
    });
  }

  login(){
   
  }

}
