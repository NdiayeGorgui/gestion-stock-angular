import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { StockService } from '../../services/stock.service';
import { MatTableDataSource } from '@angular/material/table';
import { DeliveredResponseDto } from '../DeliveredResponseDto';

@Component({
  selector: 'app-delivered-orders',
  standalone: false,

  templateUrl: './delivered-orders.component.html',
  styleUrl: './delivered-orders.component.css'
})
export class DeliveredOrdersComponent implements OnInit {

  public isLoading = true;
  public delivers: any;

 ship: DeliveredResponseDto = {
               orderId: '',
               paymentId: '',
               customerName: '',
               customerMail: '',
               amount: 0,
               totalTax: 0,
               totalDiscount: 0,
               deliveryStatus: '',
               timeStamp: new Date(),
               products: []  // 
           };

  dataSource = new MatTableDataSource<DeliveredResponseDto>([]);
      
               displayedColumns: string[] = [
        'orderId',
        'customerName',
        'customerMail',
        'amount',
        'timeStamp',
        'deliveryStatus',
        'action'
      ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private router: Router, private stockService: StockService, private activatedRoute: ActivatedRoute) {
  }



  public getDelivers() {
    this.stockService.getDeliveredQueryList().subscribe({
      next: data => {
        this.delivers = data;
        this.dataSource = new MatTableDataSource(this.delivers)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;

      },
      error: err => {
        console.log(err);
        this.isLoading = false;

      }

    });

  }
  ngOnInit(): void {

    this.getDelivers();

  }


  filterDelivers(event: Event) {
    let value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }


  deliverOrder(orderId: string) {
    this.router.navigate(['/admin/deliver-order', orderId]);
  }


}
