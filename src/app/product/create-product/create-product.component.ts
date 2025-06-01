import { Component, OnInit } from '@angular/core';
import { Products } from '../products';
import { StockService } from '../../services/stock.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AddConfirmDialogComponent } from '../../shared/add-confirm-dialog/add-confirm-dialog.component';
import { SnakBarComponent } from '../../shared/snak-bar/snak-bar.component';

@Component({
  selector: 'app-create-product',
  standalone: false,

  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css'
})
export class CreateProductComponent implements OnInit {

  product: Products = new Products();

  constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private stockService: StockService, private router: Router) {

  }
  ngOnInit(): void {

  }
  goToProductList() {
    // this.router.navigate(['/admin/product']);
    this.router.navigateByUrl("/admin/create-product");
  }

  newProduct() {
    if (!this.product.name || !this.product.category || this.product.price == null || this.product.qty == null) {
      this.snackBar.openFromComponent(SnakBarComponent, {
        data: {
          message: 'Please fill in all required fields !',
          type: 'error'
        },
        duration: 3000
      });
      return;
    }

    const dialogRef = this.dialog.open(AddConfirmDialogComponent, {
      data: { message: 'Do you want to save this product?' }
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.stockService.createProduct(this.product).subscribe({
          next: (prod) => {
            this.snackBar.openFromComponent(SnakBarComponent, {
              data: {
                message: 'Product saved successfully !',
                type: 'success'
              },
              duration: 3000
            });
            this.stockService.notifyProductCreated(); // 🚀 Notifie les observateurs

            this.router.navigate(['/admin/product']);
          },
          error: (err) => {
            console.error('Error while saving product', err);
            this.snackBar.openFromComponent(SnakBarComponent, {
              data: {
                message: 'Error while saving product, please try again !',
                type: 'error'
              },
              duration: 3000
            });
          }
        });
      }
    });
  }



  onSubmit() {

    this.newProduct();
  }

}
