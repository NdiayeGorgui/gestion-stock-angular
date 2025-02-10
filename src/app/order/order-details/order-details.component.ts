import { Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderEvent } from '../orders/orderEvent';
import { ProductItem } from '../productItem';

@Component({
  selector: 'app-order-details',
  standalone: false,
  
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent implements OnInit{

 

   //order:OrderEvent=new OrderEvent();
   orderEvent:any;
        orderIdEvent!:string;
       constructor(private stockService:StockService,private activatedRoute:ActivatedRoute,private router:Router){
     
        }
      
        ngOnInit(): void {
      
          this.orderIdEvent=this.activatedRoute.snapshot.params['orderIdEvent'];
      
          this.stockService.getOrderById(this.orderIdEvent).subscribe({
           next:data=>{
            this.orderEvent=data;
           },error:err=>{
            console.log(err);
          }
          });
          
        }

}
