import { Component, OnInit } from '@angular/core';
import { AmountDto } from '../create-payment/amountDto';
import { Custom } from '../../customer/custom';
import { Payment } from '../payment';
import { StockService } from '../../services/stock.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment-details',
  standalone: false,

  templateUrl: './payment-details.component.html',
  styleUrl: './payment-details.component.css'
})
export class PaymentDetailsComponent implements OnInit {



  customer: Custom = new Custom();
  customerIdEvent!: string;
  status!: string;

  amountDto: AmountDto = { amount: 0, totalAmount: 0, tax: 0, discount: 0 };  // Défaut pour éviter undefined

  paymentIdEvent!: string;

  payment: Payment = new Payment();

  constructor(private stockService: StockService, private router: Router, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.paymentIdEvent = this.activatedRoute.snapshot.params['paymentIdEvent'];

    // Récupérer le paiement
    this.stockService.getPaymentById(this.paymentIdEvent).subscribe({
      next: data => {
        this.payment = data;

        // Récupérer le nom du client basé sur customerIdEvent
        this.getCustomerName(this.payment.customerIdEvent);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  getCustomerName(customerId: string) {
    if (!customerId) {
      //this.customer = { id: '', customerIdEvent: '', name: 'Unknown', address: '', phone: '',email: '' };  // Si le customerId est vide
      return;
    }

    this.stockService.getCustomerById(customerId).subscribe({
      next: customerData => {
        this.customer = customerData;
      },
      error: err => {
        console.log('Erreur lors de la récupération du client:', err);
        //  this.customer = { name: 'Unknown' };  // En cas d'erreur, afficher "Unknown"
      }
    });
  }




  getCustomerById() {
    this.stockService.getCustomerById(this.customerIdEvent).subscribe({
      next: data => {
        this.customer = data;
      }, error: err => {
        console.log(err);
      }
    });
  }

  close() {
  this.router.navigate(['/admin/payment']);
}


}
