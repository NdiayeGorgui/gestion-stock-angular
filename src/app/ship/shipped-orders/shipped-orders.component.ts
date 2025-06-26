import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { StockService } from '../../services/stock.service';
import { MatTableDataSource } from '@angular/material/table';
import { ShipResponseDto } from '../ShipResponseDto';

@Component({
  selector: 'app-shipped-orders',
  standalone: false,
  
  templateUrl: './shipped-orders.component.html',
  styleUrl: './shipped-orders.component.css'
})
export class ShippedOrdersComponent implements OnInit{

   public ships:any;
     ship: ShipResponseDto = {
              orderId: '',
              paymentId: '',
              customerName: '',
              customerMail: '',
              amount: 0,
              totalTax: 0,
              totalDiscount: 0,
              shippingStatus: '',
              eventTimeStamp: new Date(),
              products: []  // 
          };
    
      public bills:any;
        dataSource = new MatTableDataSource<ShipResponseDto>([]);
    
             displayedColumns: string[] = [
      'orderId',
      'customerName',
      'customerMail',
      'amount',
      'eventTimeStamp',
      'shippingStatus',
      'action'
    ];
    
      
      @ViewChild(MatPaginator) paginator!:MatPaginator;
      @ViewChild(MatSort) sort!:MatSort;
      constructor(private router:Router, private stockService:StockService,private activatedRoute:ActivatedRoute){
      }



 public getShips(){
       this.stockService.getShippingList().subscribe({
         next: data=>{
           this.ships=data;
           this.dataSource=new MatTableDataSource(this.ships)
           this.dataSource.paginator=this.paginator;
           this.dataSource.sort=this.sort;
         },
         error:err=>{
           console.log(err);
         }
   
       });
       
     }
     ngOnInit(): void {
       
     this.getShips();
       
     }

   
     filterShip(event:Event){
       let value=(event.target as HTMLInputElement).value;
       this.dataSource.filter = value;
     }
 
   
     shipOrder(orderId:string){
       this.router.navigate(['/admin/ship-order',orderId]);
     }
   

}
