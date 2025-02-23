import { Component, OnInit, ViewChild } from '@angular/core';
import { StockService } from '../../services/stock.service';

import { ActivatedRoute, Router } from '@angular/router';

import { OrderEvent } from './orderEvent';
import { Customer } from '../customer';
import { Product } from '../product';
import { ProductItem } from '../productItem';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-order',
  standalone: false,
  
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit{

 // oder:Order=new Order();
 
  customer:Customer=new Customer();
  customerId!:string;
  customerName!:string;
  customerEmail!:string;
  customerPhone!:string;
  customerAddress!:string;

  product:Product=new Product();
  productId!:string;
  productName!:string;
  productPrice!:number;
  productQty!:number;
  date!:Date;
  amount!:number;
  discount!:number;
  price!:number;
  orderIdEvent!:string;


  //productItem:ProductItem=new ProductItem();
  producItemtQty!:number;
 
  
  orderEvent:OrderEvent=new OrderEvent();
  order:OrderEvent=new OrderEvent();
  status='CREATED';


   public orders:any;
      public dataSource:any;
      //customerIdEvent!:string;

      productItem:any= {
        
        product:{},
        order:{
          customer:{}
        }
      };
    
      public displayedColumns=["customerName","productName","price","qty","amount","discount","status","payment","cancel","details"]
      
      @ViewChild(MatPaginator) paginator!:MatPaginator;
      @ViewChild(MatSort) sort!:MatSort;
  constructor(private stockService:StockService,private router:Router,private activatedRoute:ActivatedRoute){

  }
  public getCreatedOrders(){
    this.stockService.getCreatedOrders(this.status).subscribe({
      next: data=>{
        this.orders=data;
        this.orders.sort((a: any, b: any) => a.order.customer.name.localeCompare(b.order.customer.name));
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

  getOrder(orderIdEvent:string){
    this.router.navigate(['/admin/order-details',orderIdEvent]);
  }

  filterOrder(event:Event){
    let value=(event.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  makePayment(customerIdEvent:string){
    this.router.navigate(['/admin/create-payment',customerIdEvent]);
  }

  cancelOrder(orderIdEvent:string){
   // this.router.navigate(['/admin/cancel-order',customerIdEvent]);
  
    let conf=confirm("Are you sure ?")
    if(conf){
      this.stockService.cancelOrder(orderIdEvent).subscribe({
        next:data=>{

          alert('Order canceled successfuly !');
          this.ngOnInit();
         //this.order=data;
         console.log(data);
        },error:err=>{
         console.log(err);
       }
       }); 
  }
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

  getRowSpan(index: number): number {
    const customer = this.orders[index].order.customer.customerIdEvent;
    let count = 1;
    
    for (let i = index + 1; i < this.orders.length; i++) {
      if (this.orders[i].order.customer.customerIdEvent === customer) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }
  
  shouldShowRowSpan(index: number): boolean {
    if (index === 0) return true;
    return this.orders[index].order.customer.customerIdEvent !== this.orders[index - 1].order.customer.customerIdEvent;
  }
  

   
}
