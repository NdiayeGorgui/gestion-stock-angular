import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderEvent } from '../orders/orderEvent';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StockService } from '../../services/stock.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../../services/NotificationService';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-completed-order',
  standalone: false,

  templateUrl: './completed-order.component.html',
  styleUrl: './completed-order.component.css'
})
export class CompletedOrderComponent implements OnInit {
  public isLoading = true;


  public createdOrders: any[] = [];
  public dataSource: MatTableDataSource<any>;
  public status = 'COMPLETED';

  public displayedColumns: string[] = [
    'orderId',
    'customerName',
    'customerEmail',
    'amount',
    'totalDiscount',
    'totalTax',
    'details',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
  
    private stockService: StockService,
    private router: Router,
   
  ) {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit(): void {
  
    this.getCreatedOrders();
  }

public getCreatedOrders(): void {
  this.stockService.getCreatedOrders(this.status).subscribe({
    next: (data) => {
      // 💡 Pas de transformation manuelle des montants ici !
      this.createdOrders = data;
console.log('✔️ Received orders:', this.createdOrders);

      this.dataSource = new MatTableDataSource(this.createdOrders);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.dataSource.filterPredicate = (order: any, filter: string) => {
        const lowercaseFilter = filter.trim().toLowerCase();
        return (
          order.orderId?.toLowerCase().includes(lowercaseFilter) ||
          order.customerName?.toLowerCase().includes(lowercaseFilter) ||
          order.customerEmail?.toLowerCase().includes(lowercaseFilter) ||
          order.amount?.toString().includes(lowercaseFilter) ||
          order.totalTax?.toString().includes(lowercaseFilter) ||
          order.totalDiscount?.toString().includes(lowercaseFilter)
        );
      };
      this.isLoading = false;

    },
    error: (err) => {
      console.error('Error fetching created orders:', err);
      this.isLoading = false;

    }
  });
}


  filterOrder(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    this.dataSource.filter = input.trim().toLowerCase();
  }

  getOrder(orderId: string): void {
    this.router.navigate(['/admin/order-created-completed-details', orderId]);
  }



}
