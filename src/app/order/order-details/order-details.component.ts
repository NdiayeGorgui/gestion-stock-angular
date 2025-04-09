import { Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderEvent } from '../orders/orderEvent';
import { ProductItem } from '../productItem';
import { MatTableDataSource } from '@angular/material/table';
import { Custom } from '../custom';
import { AmountDto } from '../../payment/create-payment/amountDto';

@Component({
  selector: 'app-order-details',
  standalone: false,

  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent implements OnInit {

  public dataSource: any;
  orders: any;
  customer: Custom = new Custom();
  status = 'CREATED';
  customerIdEvent!: string;
  productItem: any = {

    product: {},
    order: {
      customer: {}
    }
  };

  public displayedColumns = ["productIdEvent", "productName", "category", "price", "qty", "discount", "amount", "status"]

  //order:OrderEvent=new OrderEvent();
  orderEvent: any;
  orderIdEvent!: string;
  amountDto: AmountDto = { amount: 0, totalAmount: 0, tax: 0, discount: 0 };  // Défaut pour éviter undefined

  constructor(private stockService: StockService, private activatedRoute: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {

    this.customerIdEvent = this.activatedRoute.snapshot.params['customerIdEvent'];
    this.stockService.getCreatedOrdersByCustomer(this.customerIdEvent, this.status).subscribe({
      next: data => {
        this.orders = data;
        console.log(data);
        this.dataSource = new MatTableDataSource(this.orders)
      }, error: err => {
        console.log(err);
      }
    });

    this.stockService.getCustomerById(this.customerIdEvent).subscribe({
      next: data => {
        this.customer = data;
        // this.getAmount();
      }, error: err => {
        console.log(err);
      }
    });

    this.getAmount();

  }

  getOrdersByCustomer(customerIdEvent: string) {
    this.stockService.getCreatedOrdersByCustomer(customerIdEvent, this.status).subscribe({
      next: data => {
        this.orders = data;
      }, error: err => {
        console.log(err);
      }
    });

  }


  getAmount() {
    this.stockService.getAmount(this.customerIdEvent, this.status).subscribe(
      (data: AmountDto) => {
        console.log("✅ Réponse API :", data);

        if (data && data.amount !== undefined && data.totalAmount !== undefined && data.tax !== undefined && data.discount !== undefined) {
          this.amountDto = data;

          console.log("🎯 Montant récupéré :", this.amountDto.amount);
        }
      },
      error => {
        console.error("❌ Erreur API :", error);
      }
    );
  }



}
