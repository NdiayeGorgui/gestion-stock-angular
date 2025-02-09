import { Component, OnInit, ViewChild } from '@angular/core';
import { Payment } from '../payment';
import { StockService } from '../../services/stock.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-payment',
  standalone: false,
  
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit{
  public payments:any;
  public dataSource:any;
  public customer:any;
  public customerName:any;

   payment:Payment=new Payment();

    public displayedColumns=["customerId","paymentMode","amount","timeStamp","paymentStatus","action"]
             
             @ViewChild(MatPaginator) paginator!:MatPaginator;
             @ViewChild(MatSort) sort!:MatSort;
  
    constructor(private stockService:StockService, private router:Router){
  
    }
    ngOnInit(): void {

      this.getPayments();
      
    }

  /*  getCustomer(id:string){
      this.stockService.getCustomerById(id).subscribe(data => {
        // alert("Customer deleted successfuly !");
          console.log(data);
         this.customer=data;
         this.customerName=this.customer.name;
        });

    }*/

    public getPayments(){
            this.stockService.getPaymentList().subscribe({
              next: data=>{
                this.payments=data;
                this.dataSource=new MatTableDataSource(this.payments)
                this.dataSource.paginator=this.paginator;
                this.dataSource.sort=this.sort;
              },
              error:err=>{
                console.log(err);
              }
        
            });
            
          }

          filterPayment(event:Event){
            let value=(event.target as HTMLInputElement).value;
            this.dataSource.filter = value;
          }
        
          getPayment(paymentIdEvent:string){
           
          }
        
          deletePayment(paymentIdEvent:string){
           
          }

}
