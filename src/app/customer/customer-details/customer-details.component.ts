import { Component, OnInit } from '@angular/core';
import { Custom } from '../custom';
import { StockService } from '../../services/stock.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-customer-details',
  standalone: false,
  
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.css'
})
export class CustomerDetailsComponent implements OnInit {

   
  
    customer:Custom=new Custom();
      customerIdEvent!:string;
     constructor(private stockService:StockService,private activatedRoute:ActivatedRoute,private router:Router){
   
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
    

}
