import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';
import { StockService } from '../../services/stock.service';
import { Custom } from '../custom';
import { Router } from '@angular/router';



@Component({
  selector: 'app-create-customer',
  standalone: false,
  
  templateUrl: './create-customer.component.html',
  styleUrl: './create-customer.component.css'
})
export class CreateCustomerComponent implements OnInit {
 // customerFormGroup!:FormGroup;
  customer:Custom=new Custom();

  readonly email = new FormControl('', [Validators.required, Validators.email]);

  errorMessage = signal('');

  constructor(private stockService:StockService,private router:Router) {
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
  /*  this.customerFormGroup=this.fb.group({
     
      name:this.fb.control(''),
      address:this.fb.control(''),
      email:this.fb.control(''),
      phone:this.fb.control('')
    


    });*/
  }

  /*newCustomer1(){
    let formData:FormData=new FormData();
   
    formData.set('name',this.customerFormGroup.value.name);
    formData.set('address',this.customerFormGroup.value.address);
    formData.set('phone',this.customerFormGroup.value.phone);
    formData.set('email',this.customerFormGroup.value.email);
  
    this.stockService.createCustomer(formData).subscribe({
      next:cust=>{
        alert('Customer saved successfuly !')

      },
      error:err=>{
        console.log(err);
      }
    });
  }*/


    
      newCustomer() {
        if (!this.customer.name || !this.customer.address || !this.customer.phone || !this.customer.email) {
          alert('Please fill in all required fields.');
          return;
        }
    
        this.stockService.createCustomer(this.customer).subscribe({
          next: (res) => {
            console.log('Réponse du serveur:', res);
            alert('Customer saved successfully!');
            
            console.log('Navigation en cours...');
            this.router.navigate(['/admin/customer'])
                .then(success => console.log('Navigation réussie:', success))
                .catch(err => console.error('Erreur de navigation:', err));
        
            
          },
          error: (err) => {
            console.error('Error:', err);
            alert('Error while saving customer. Please try again.');
          }
        });
       
      }
    
    

}

