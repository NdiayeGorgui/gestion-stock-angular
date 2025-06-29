import { Component, OnInit, ViewChild } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { Router } from '@angular/router';
import { Bill } from '../bill';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BillResponseDto } from '../BillResponseDto';
import { ProductItemResponseDto } from '../../payment/ProductItemResponseDto';

@Component({
  selector: 'app-bill',
  standalone: false,
  
  templateUrl: './bill.component.html',
  styleUrl: './bill.component.css'
})
export class BillComponent implements OnInit {

  public isLoading = true;

   bill: BillResponseDto = {
          orderId: '',
          customerName: '',
          customerPhone: '',
          customerMail: '',
          paymentMode: '',
          amount: 0,
          totalTax: 0,
          totalDiscount: 0,
          billStatus: '',
          billingDate: new Date(),
          products: []  // 
      };

  public bills:any;
    dataSource = new MatTableDataSource<BillResponseDto>([]);

         displayedColumns: string[] = [
  'orderId',
  'customerName',
  'customerMail',
  'amount',
  'billingDate',
  'billStatus',
  'details'
];

               
               @ViewChild(MatPaginator) paginator!:MatPaginator;
               @ViewChild(MatSort) sort!:MatSort;

   constructor(private stockService:StockService, private router:Router){
    
      }
      ngOnInit(): void {
  
        this.getBills();
        
      }

    

   public getBills() {
      this.stockService.getBillList().subscribe({
        next: data => {
          this.bills = data; // ✅ Tableau de BillResponseDto
          this.dataSource = new MatTableDataSource(this.bills); // ✅ Assigner le tableau complet

          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          console.log('✅ Liste des factures chargée :', this.bills);
          this.isLoading = false;
        },
        error: err => {
          console.error('❌ Erreur lors du chargement des factures :', err);
          this.isLoading = false;
        }
      });
    }

      
                filterBill(event:Event){
                  let value=(event.target as HTMLInputElement).value;
                  this.dataSource.filter = value;
                }
              
                getBill(orderRef:string){
                  this.router.navigate(['/admin/bill-details',orderRef]);
                }
              
  

}
