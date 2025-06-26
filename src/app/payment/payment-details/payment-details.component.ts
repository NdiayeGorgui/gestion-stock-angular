import { Component, OnInit } from '@angular/core';
import { AmountDto } from '../create-payment/amountDto';
import { Custom } from '../../customer/custom';
import { Payment } from '../payment';
import { StockService } from '../../services/stock.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentResponseDto } from '../PaymentResponseDto';
import { MatTableDataSource } from '@angular/material/table';
import { ProductItemResponseDto } from '../ProductItemResponseDto';

@Component({
  selector: 'app-payment-details',
  standalone: false,

  templateUrl: './payment-details.component.html',
  styleUrl: './payment-details.component.css'
})
export class PaymentDetailsComponent implements OnInit {

  public orderId!:string;

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
     dataSource = new MatTableDataSource<ProductItemResponseDto>([]);
      displayedColumns: string[] = ['productId', 'productName', 'quantity', 'price', 'discount', 'tax'];

  

  constructor(private stockService: StockService, private router: Router, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.orderId = this.activatedRoute.snapshot.params['orderId'];

    // Récupérer le paiement
    this.stockService.getPaymentById(this.orderId).subscribe({
      next: data => {
        this.payment = data;
          this.dataSource.data = data.products;
          console.log('✅ Données chargées :', data);
    
      },
      error: err => {
        console.log(err);
      }
    });
  }

 

  close() {
  this.router.navigate(['/admin/payment']);
}


}
