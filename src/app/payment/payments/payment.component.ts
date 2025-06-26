import { Component, OnInit, ViewChild } from '@angular/core';
import { Payment } from '../payment';
import { StockService } from '../../services/stock.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Custom } from '../../customer/custom';
import { PaymentResponseDto } from '../PaymentResponseDto';

@Component({
  selector: 'app-payment',
  standalone: false,

  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  public payments: any;
  payment: PaymentResponseDto = {
    paymentIdEvent: '',
    orderId: '',
    customerName: '',
    customerMail: '',
    paymentMode: '',
    amount: 0,
    totalTax: 0,
    totalDiscount: 0,
    paymentStatus: '',
    timeStamp: new Date(),
    products: []  // 
  };
  dataSource = new MatTableDataSource<PaymentResponseDto>([]);
  public displayedColumns = ["orderId", "customerId", "paymentMode", "amount", "timeStamp", "paymentStatus", "details"]

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private stockService: StockService, private router: Router) {

  }
  ngOnInit(): void {

    this.getPayments();

  }

  public getPayments() {
    this.stockService.getPaymentList().subscribe({
      next: data => {


        this.payments = data; // ✅ Tableau de BillResponseDto
        this.dataSource = new MatTableDataSource(this.payments); // ✅ Assigner le tableau complet


        this.dataSource = new MatTableDataSource(this.payments);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      },
      error: err => console.log(err)
    });
  }

  filterPayment(event: Event) {
    let value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  getPayment(orderId: string) {
    this.router.navigate(['/admin/payment-details', orderId]);
  }

}