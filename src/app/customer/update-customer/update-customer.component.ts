import { Component, OnInit, signal } from '@angular/core';
import { Custom } from '../custom';
import { StockService } from '../../services/stock.service';
import { ActivatedRoute, Router } from '@angular/router';
import { merge } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-update-customer',
  standalone: false,
  
  templateUrl: './update-customer.component.html',
  styleUrl: './update-customer.component.css'
})
export class UpdateCustomerComponent implements OnInit {
  
    readonly email = new FormControl('', [Validators.required, Validators.email]);
  
    errorMessage = signal('');

  customer:Custom=new Custom();
    customerIdEvent!:string;
   constructor(private stockService:StockService,private activatedRoute:ActivatedRoute,private router:Router){
   merge(this.email.statusChanges, this.email.valueChanges)
        .pipe(takeUntilDestroyed())
        .subscribe(() => this.updateErrorMessage());
    }
    updateErrorMessage() {
      if (this.email.hasError('required')) {
        this.errorMessage.set('You must enter a value');
      } else if (this.email.hasError('email')) {
        this.errorMessage.set('Not a valid email');
      } else {
        this.errorMessage.set('');
      }
    }
    ngOnInit(): void {
  
      this.customerIdEvent=this.activatedRoute.snapshot.params['customerIdEvent'];
  
      this.stockService.getCustomerById(this.customerIdEvent).subscribe({
       next:data=>{
        this.customer=data;
       },error:err=>{
        console.log(err);
      }
      });
      
    }
  
    updateCustomer(){
      this.stockService.updateCustomer(this.customerIdEvent,this.customer).subscribe({
        next:data=>{
         // alert("Customer updated successfuly!");
         },error:err=>{
          console.log(err);
        }
        });

        alert('Customer updated successfuly !');
        this.router.navigateByUrl("/admin/customer");
    }

}
