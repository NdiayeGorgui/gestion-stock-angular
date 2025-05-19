import { Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddConfirmDialogComponent } from '../../shared/add-confirm-dialog/add-confirm-dialog.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogAlertComponent } from '../../shared/dialog-alert/dialog-alert.component';

@Component({
  standalone: true,
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ],
  imports: [CommonModule, FormsModule]
})
export class CreateOrderComponent implements OnInit {
  public customers: any;
  public products: any;

  selectedClientId: string = '';
  selectedClient: any = null;

  selectedProductId: string = '';
  selectedProduct: any = null;

  itemQty: number = 1;

  amount: number = 0;
  tax: number = 0;
  discount: number = 0;
  price: number = 0;

  orderItems: any[] = [];
  showOrderDetails: boolean = false;
  showPaymentButton: boolean = false;

  constructor(
    private dialogAlready: MatDialog,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private stockService: StockService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCustomers();
    this.getProducts();
  }

  onClientChange() {
    this.selectedClient = this.customers.find((c: { id: number }) => c.id == +this.selectedClientId);
  }

  onProductChange() {
    this.selectedProduct = this.products.find((p: { id: number }) => p.id == +this.selectedProductId);
    this.itemQty = 1;
    this.updateAmounts();
  }

  onQtyChange() {
    this.updateAmounts();
  }

  getDiscount(qty: number, price: number) {
    const total = qty * price;
    if (total < 100) {
      return 0;
    } else if (total < 200) {
      return 0.005 * total;
    } else {
      return 0.01 * total;
    }
  }

  updateAmounts() {
    if (this.selectedProduct && this.itemQty > 0) {
      const price = Number(this.selectedProduct.price);
      const qty = Number(this.itemQty);
      const total = qty * price;

      this.price = total;
      this.tax = total * 0.2;
      this.discount = this.getDiscount(qty, price);
      this.amount = this.price + this.tax - this.discount;
    } else {
      this.price = this.tax = this.discount = this.amount = 0;
    }
  }

addProductToOrder() {
  if (!this.selectedProduct) return;

  // Vérifie si la quantité est invalide (<= 0)
  if (this.itemQty <= 0) {
    this.dialogAlready.open(DialogAlertComponent, {
      data: {
        title: 'Invalid Quantity',
        message: 'Please select a valid number.'
      }
    });
    return;
  }

  // Vérifie si le produit est déjà dans le panier
  const alreadyExists = this.orderItems.some(
    item => item.id === this.selectedProduct.id
  );

  if (alreadyExists) {
    this.dialogAlready.open(DialogAlertComponent, {
      data: {
        title: 'Product already present',
        message: 'This product is already in the cart.'
      }
    });
    return;
  }

  // Vérifie si la quantité demandée dépasse le stock disponible
  if (this.itemQty > this.selectedProduct.qty) {
    this.dialogAlready.open(DialogAlertComponent, {
      data: {
        title: 'Insufficient Stock',
        message: `Only ${this.selectedProduct.qty} items left in stock.`
      }
    });
    return;
  }

  const newItem = {
    ...this.selectedProduct,
    qty: this.itemQty,
    amount: this.amount,
    price: this.price,
    tax: this.tax,
    discount: this.discount
  };

  this.orderItems.push(newItem);
  this.resetCurrentProduct();
}


  removeItem(index: number) {
    this.orderItems.splice(index, 1);
  }

  toggleOrderDetails() {
    this.showOrderDetails = !this.showOrderDetails;
  }

  get onePrice() {
    return this.orderItems.reduce((sum, item) => sum + item.price, 0);
  }

  get totalPrice() {
  return this.orderItems.reduce((sum, item) => sum + (item.price ), 0);
}

  get totalAmount() {
    return this.orderItems.reduce((sum, item) => sum + item.amount, 0);
  }

  get totalTax() {
    return this.orderItems.reduce((sum, item) => sum + item.tax, 0);
  }

  get totalDiscount() {
    return this.orderItems.reduce((sum, item) => sum + item.discount, 0);
  }

  get totalItems() {
    return this.orderItems.reduce((sum, item) => sum + item.qty, 0);
  }

  getProducts() {
    this.stockService.getProductsOrderList().subscribe({
      next: data => this.products = data,
      error: err => console.error(err)
    });
  }

  getCustomers() {
    this.stockService.getCustomersOrderList().subscribe({
      next: data => this.customers = data,
      error: err => console.error(err)
    });
  }

async submitOrder() {
  if (!this.selectedClient || this.orderItems.length === 0) {
    this.snackBar.open('Please select a customer and add at least one product.', 'Close', {
      duration: 3000,
      panelClass: 'snackbar-error'
    });
    return;
  }

  const dialogRef = this.dialog.open(AddConfirmDialogComponent, {
    data: { message: 'Do you want to confirm this order?' }
  });

  dialogRef.afterClosed().subscribe(async confirmed => {
    if (!confirmed) return;

    try {
      for (const item of this.orderItems) {
        const orderToSubmit: any = {  
          customer: {
            customerIdEvent: this.selectedClient.customerIdEvent
          },
          product: {
            productIdEvent: item.productIdEvent
          },
          productItem: {
            productQty: item.qty
          }
        };

        await this.stockService.createOrder(orderToSubmit).toPromise();
        await new Promise(resolve => setTimeout(resolve, 300)); // délai de 300ms
      }

      this.snackBar.open('Order submitted successfully!', 'Close', {
        duration: 3000,
        panelClass: 'snackbar-success'
      });
      this.showPaymentButton = true;
      this.resetCart();
    } catch (err: any) {
  console.error('Error submitting order item:', err);

  // Extraction du message d'erreur du backend
  const errorMessage =
  err?.error?.message || err?.error?.error || err?.message || 'Error while submitting order. Please try again.';

  this.snackBar.open(errorMessage, 'Close', {
    duration: 4000,
    panelClass: 'snackbar-error'
  });
}

  });
}

  resetForm() {
    this.resetCart();
    this.selectedClientId = '';
    this.selectedClient = null;
  }

  resetCart() {
    this.orderItems = [];
    this.amount = this.price = this.tax = this.discount = 0;
    this.itemQty = 1;
    this.showOrderDetails = false;
  }

  resetCurrentProduct() {
    this.selectedProductId = '';
    this.selectedProduct = null;
    this.itemQty = 1;
    this.amount = this.price = this.tax = this.discount = 0;
  }

  goToCreatedOrders() {
    this.router.navigate(['/admin/order']);
  }
}
