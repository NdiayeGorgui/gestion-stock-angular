import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderEvent } from '../orders/orderEvent';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StockService } from '../../services/stock.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-completed-order',
  standalone: false,
  
  templateUrl: './completed-order.component.html',
  styleUrl: './completed-order.component.css'
})
export class CompletedOrderComponent implements OnInit{

  orderEvent:OrderEvent=new OrderEvent();
    order:OrderEvent=new OrderEvent();
    status='COMPLETED';
    nom!:string;
  
  
     public orders:any;
        public dataSource:any;
        //customerIdEvent!:string;
  
        productItem:any= {
          
          product:{},
          order:{
            customer:{}
          }
        };
      
        public displayedColumns=["customerName","productName","price","qty","amount","discount","date","status","details"]
        
        @ViewChild(MatPaginator) paginator!:MatPaginator;
        @ViewChild(MatSort) sort!:MatSort;
    constructor(private stockService:StockService,private router:Router,private activatedRoute:ActivatedRoute){
  
    }
    public getCreatedOrders(){
      this.stockService.getCreatedOrders(this.status).subscribe({
        next: data=>{
          this.orders=data;
          this.dataSource=new MatTableDataSource(this.orders)
          this.dataSource.paginator=this.paginator;
          this.dataSource.sort=this.sort;
        },
        error:err=>{
          console.log(err);
        }
  
      });
      
    }
   
        
  
    ngOnInit(): void {
      this.getCreatedOrders();
      
    }
  
  
  
    filterOrder(event:Event){
      let value=(event.target as HTMLInputElement).value;
      this.dataSource.filter = value;
    }
  
    deleteOrder(customerIdEvent:string){
      
    }
  
    getOrder(orderIdEvent:string){
      this.router.navigate(['/admin/order-created-completed-details',orderIdEvent]);
    }
  
    newOrder(){
  
      this.stockService.createOrder(this.orderEvent).subscribe({
        next:prod=>{
        
        },
        error:err=>{
          console.log(err);
        }
     
      });
      alert('Product saved successfuly !');
      this.router.navigate(['/admin/order']);
    }

    searchTitle(){
      if(this.nom!=""){
        this.orders=this.orders.filter((res: { custom: { name: string; }; })=>{
          return res.custom.name.toLowerCase().match(this.nom.toLowerCase());
        });
      }else if(this.nom==""){
        this.ngOnInit();
      }
    
    }

}
