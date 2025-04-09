import { Component, OnInit } from '@angular/core';
import { Deliverd } from '../Delivered';
import { StockService } from '../../services/stock.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-deliver-order',
  standalone: false,

  templateUrl: './deliver-order.component.html',
  styleUrl: './deliver-order.component.css'
})
export class DeliverOrderComponent implements OnInit {

  delivered: Deliverd = new Deliverd();
  orderId!: string;

  constructor(private stockService: StockService, private router: Router, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.orderId = this.activatedRoute.snapshot.params['orderId'];

    this.stockService.getDeliveredById(this.orderId).subscribe({
      next: data => {
        this.delivered = data;
      }, error: err => {
        console.log(err);
      }
    });


  }

  newDeliver() {

    this.stockService.createDeliveredCommand(this.delivered).subscribe({
      next: (res) => {
        console.log('Réponse du serveur:', res);
        alert('Order delivered successfully!');

        console.log('Navigation en cours...');
        this.router.navigate(['/admin/delivered-orders'])
          .then(success => console.log('Navigation réussie:', success))
          .catch(err => console.error('Erreur de navigation:', err));


      },
      error: (err) => {
        console.error('Error:', err);
        alert('Error while delivering order. Please try again.');
      }
    });

  }

}
