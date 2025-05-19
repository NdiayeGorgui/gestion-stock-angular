import { Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { Products } from '../products';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddConfirmDialogComponent } from '../../shared/add-confirm-dialog/add-confirm-dialog.component';

@Component({
  selector: 'app-update-product',
  standalone: false,

  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css'
})
export class UpdateProductComponent implements OnInit {

  product: Products = new Products();
  productIdEvent!: string;
  constructor(private snackBar: MatSnackBar,private dialog: MatDialog,private stockService: StockService, private activatedRoute: ActivatedRoute, private router: Router) {

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
  if (!this.product.name || !this.product.category || this.product.price == null || this.product.qty == null) {
    this.snackBar.open('Veuillez remplir tous les champs requis.', 'Fermer', {
      duration: 3000,
      panelClass: 'snackbar-error'
    });
    return;
  }

  const dialogRef = this.dialog.open(AddConfirmDialogComponent, {
    data: { message: 'Do you want to update this product?' }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      this.stockService.updateProduct(this.productIdEvent, this.product).subscribe({
        next: () => {
          this.snackBar.open('Product updated successfully!', 'Close', {
            duration: 3000,
            panelClass: 'snackbar-success'
          });

          // Force un vrai "refresh" de la route
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/admin/product']);
          });
        },
        error: (err) => {
          console.error('Error while updating product:', err);
          this.snackBar.open('Error while updating product.', 'Close', {
            duration: 3000,
            panelClass: 'snackbar-error'
          });
        }
      });
    }
  });
}




}
