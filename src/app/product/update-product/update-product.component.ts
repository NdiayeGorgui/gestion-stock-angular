import { Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { Products } from '../products';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddConfirmDialogComponent } from '../../shared/add-confirm-dialog/add-confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { SnakBarComponent } from '../../shared/snak-bar/snak-bar.component';

@Component({
  selector: 'app-update-product',
  standalone: false,

  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css'
})
export class UpdateProductComponent implements OnInit {

  product: Products = new Products();
  productIdEvent!: string;
  constructor(private snackBar: MatSnackBar,
     private dialog: MatDialog, private stockService: StockService,
      private activatedRoute: ActivatedRoute, private router: Router,
    private translate: TranslateService) {

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

  updateProduct() {
  if (!this.product.name || !this.product.category || this.product.price == null || this.product.qty == null|| this.product.description == null|| this.product.location == null) {
    this.snackBar.openFromComponent(SnakBarComponent, {
      data: {
        message: this.translate.instant('product.fill_required'),
        type: 'error'
      },
      duration: 3000
    });
    return;
  }

  const dialogRef = this.dialog.open(AddConfirmDialogComponent, {
    data: {
      message: this.translate.instant('product.confirm_update')
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      this.stockService.updateProduct(this.productIdEvent, this.product).subscribe({
        next: () => {
          this.snackBar.openFromComponent(SnakBarComponent, {
            data: {
              message: this.translate.instant('product.update_success'),
              type: 'success'
            },
            duration: 3000
          });

          this.stockService.notifyProductUpdated();
          this.router.navigate(['/admin/product']);
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du produit :', err);
          this.snackBar.openFromComponent(SnakBarComponent, {
            data: {
              message: this.translate.instant('product.update_error'),
              type: 'error'
            },
            duration: 3000
          });
        }
      });
    }
  });
}





}
