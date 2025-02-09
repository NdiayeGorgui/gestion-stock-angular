import { Component, OnInit, ViewChild } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { Router } from '@angular/router';
import { Bill } from '../bill';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-bill',
  standalone: false,
  
  templateUrl: './bill.component.html',
  styleUrl: './bill.component.css'
})
export class BillComponent implements OnInit {

  public bills:any;
    public dataSource:any;
  
     bill:Bill=new Bill();
  
      public displayedColumns=["orderRef","customerName","productName","quantity","price","discount","billingDate","status","action"]
               
               @ViewChild(MatPaginator) paginator!:MatPaginator;
               @ViewChild(MatSort) sort!:MatSort;

   constructor(private stockService:StockService, private router:Router){
    
      }
      ngOnInit(): void {
  
        this.getBills();
        
      }

    

       public getBills(){
                  this.stockService.getBillList().subscribe({
                    next: data=>{
                      this.bills=data;
                      this.dataSource=new MatTableDataSource(this.bills)
                      this.dataSource.paginator=this.paginator;
                      this.dataSource.sort=this.sort;
                    },
                    error:err=>{
                      console.log(err);
                    }
              
                  });
                  
                }
      
                filterBill(event:Event){
                  let value=(event.target as HTMLInputElement).value;
                  this.dataSource.filter = value;
                }
              
                getBill(orderRef:string){
                 
                }
              
                deleteBill(orderRef:string){
                 
                }

}
