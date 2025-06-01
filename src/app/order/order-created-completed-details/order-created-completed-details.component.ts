import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-order-created-completed-details',
  standalone: false,
  templateUrl: './order-created-completed-details.component.html',
  styleUrl: './order-created-completed-details.component.css'
})
export class OrderCreatedCompletedDetailsComponent {


  //order:OrderEvent=new OrderEvent();
  orderEvent: any;
  orderIdEvent!: string;
  constructor(private stockService: StockService, private activatedRoute: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {

    this.orderIdEvent = this.activatedRoute.snapshot.params['orderIdEvent'];

    this.stockService.getOrderById(this.orderIdEvent).subscribe({
      next: data => {
        this.orderEvent = data;
      }, error: err => {
        console.log(err);
      }
    });

  }

 close() {
  const status = this.orderEvent?.order?.orderStatus?.toLowerCase();

  if (status === 'completed') {
    this.router.navigate(['/admin/completed-order']);
  } else if (status === 'canceled') {
    this.router.navigate(['/admin/cancel-order']);
  } else {
    // Redirection par défaut
    this.router.navigate(['/admin/orders']);
  }
}



}
