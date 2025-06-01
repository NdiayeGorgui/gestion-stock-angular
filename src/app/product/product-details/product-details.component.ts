import { Component, OnInit } from '@angular/core';
import { Products } from '../products';
import { StockService } from '../../services/stock.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-details',
  standalone: false,

  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {

  product: Products = new Products();
  productIdEvent!: string;
  constructor(private stockService: StockService, private activatedRoute: ActivatedRoute, private router: Router) {

  }
  ngOnInit(): void {

    this.productIdEvent = this.activatedRoute.snapshot.params['productIdEvent'];

    this.stockService.getProductById(this.productIdEvent).subscribe({
      next: data => {
        this.product = data;
      }, error: err => {
        console.log(err);
      }
    });

  }
close() {
  this.router.navigate(['/admin/product']);
}


}
