import { Component, OnInit } from '@angular/core';
import { Products } from '../products';
import { StockService } from '../../services/stock.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-product-details',
  standalone: false,

  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {

  product: Products = new Products();
  productIdEvent!: string;
  constructor(private stockService: StockService, private activatedRoute: ActivatedRoute, private router: Router, private translate: TranslateService) {

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

  getQtyStatusLabel(status: string): string {
    switch (status) {
      case 'AVAILABLE':
        return this.translate.instant('form.qtyStatus.available');
      case 'UNAVAILABLE':
        return this.translate.instant('form.qtyStatus.unavailable');
      case 'LOW':
        return this.translate.instant('form.qtyStatus.low');
      default:
        return status;
    }
  }


}
