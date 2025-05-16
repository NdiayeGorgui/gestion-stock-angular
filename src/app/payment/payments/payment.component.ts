import { Component, OnInit, ViewChild } from '@angular/core';
import { Payment } from '../payment';
import { StockService } from '../../services/stock.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Custom } from '../../customer/custom';

@Component({
  selector: 'app-payment',
  standalone: false,

  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  public payments: any;
  public dataSource: any;
  public customer: any;
  public customers: any;
  public customerName: any;
  public customerIdEvent!: string;


  payment: Payment = new Payment();

  public displayedColumns = ["customerId", "paymentMode", "amount", "timeStamp", "paymentStatus", "details"]

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private stockService: StockService, private router: Router) {

  }
  ngOnInit(): void {

    this.getPayments();

  }


  public getPayments() {
    this.stockService.getPaymentList().subscribe({
      next: payments => {

        this.stockService.getCustomersList().subscribe({
          next: customers => {

            // Créer un mapping ID → Nom
            const customerMap = new Map(customers.map(c => [c.customerIdEvent, c.name]));

            // Associer `customerName` aux paiements
            this.payments = payments.map(payment => ({
              ...payment,
              customerName: customerMap.get(payment.customerIdEvent) || 'Unknown'
            }));

            this.dataSource = new MatTableDataSource(this.payments);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          },
          error: err => console.log(err)
        });
      },
      error: err => console.log(err)
    });
  }

  filterPayment(event: Event) {
    let value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  getPayment(paymentIdEvent: string) {
    this.router.navigate(['/admin/payment-details', paymentIdEvent]);
  }

  deletePayment(paymentIdEvent: string) {

  }

}