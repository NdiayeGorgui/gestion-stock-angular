import { Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddConfirmDialogComponent } from '../../shared/add-confirm-dialog/add-confirm-dialog.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';
import { DialogAlertComponent } from '../../shared/dialog-alert/dialog-alert.component';
import { OrderCartDialogComponent } from '../order-cart-dialog/order-cart-dialog.component';
import { Observable } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { SnakBarComponent } from '../../shared/snak-bar/snak-bar.component';
import { MatCardModule} from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { MatDividerModule } from '@angular/material/divider';
import { NotificationService } from '../../services/NotificationService';




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
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule,MatCardModule,TranslateModule,MatDividerModule]
})
export class CreateOrderComponent implements OnInit {
  customerFilter: string = '';
  filteredCustomers: any[] = [];

  productFilter: string = '';
  filteredProducts: any[] = [];

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
    private router: Router,
    private notifService: NotificationService
  ) { }

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

  onCustomerChange() {
    this.selectedClient = this.customers.find((c: { id: number }) => c.id == +this.selectedClientId);

  }
  onCustomerSelected(customer: any) {
    console.log('customer selected :', customer);
    this.selectedClient = customer;
    this.selectedClientId = customer.id.toString();
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
          message: 'This product is already in the cart, please update quantity.'
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
      qtyAvailable: this.selectedProduct.qty,
      unitPrice: Number(this.selectedProduct.price),
      price: this.selectedProduct.price, // prix unitaire
      tax: this.selectedProduct.price * this.itemQty * 0.2,
      discount: this.getDiscount(this.itemQty, this.selectedProduct.price),
      amount: this.itemQty * this.selectedProduct.price * 1.2 - this.getDiscount(this.itemQty, this.selectedProduct.price)

    };


    this.orderItems.push(newItem);
    this.resetCurrentProduct();
  }


  removeItem(index: number) {
    this.orderItems.splice(index, 1);
  }

  toggleOrderDetails() {
    const dialogRef = this.dialog.open(OrderCartDialogComponent, {
      width: '800px',
      data: {
        orderItems: this.orderItems,
        selectedClient: this.selectedClient
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.placeOrder) {
        this.submitOrder(); // ⬅️ ta méthode originale est appelée ici
      }
    });
  }




  get onePrice() {
    return this.orderItems.reduce((sum, item) => sum + item.price, 0);
  }

  get totalPrice() {
    return this.orderItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }

  get totalTax() {
    return this.orderItems.reduce((sum, item) => sum + item.tax, 0);
  }

  get totalDiscount() {
    return this.orderItems.reduce((sum, item) => sum + item.discount, 0);
  }

  get totalAmount() {
    return this.totalPrice + this.totalTax - this.totalDiscount;
  }


  get totalItems() {
    return this.orderItems.reduce((sum, item) => sum + item.qty, 0);
  }
  getCustomers() {
    this.stockService.getCustomersOrderList().subscribe({
      next: data => {
        this.customers = data;
        this.filteredCustomers = [...this.customers]; // ← doit être ici, après réception
      },
      error: err => console.error(err)
    });
  }

  filterCustomers() {
    const filterValue = this.customerFilter.toLowerCase();
    this.filteredCustomers = this.customers.filter((c: { name: string }) =>
      c.name.toLowerCase().includes(filterValue)
    );
  }

  getProducts() {
    this.stockService.getProductsOrderList().subscribe({
      next: data => {
        this.products = data;
        this.filteredProducts = [...this.products]; // ← placé ici, après réception des données
      },
      error: err => console.error(err)
    });
  }


  filterProducts() {
    const filterValue = this.productFilter.toLowerCase();
    this.filteredProducts = this.products.filter((p: { name: string }) =>
      p.name.toLowerCase().includes(filterValue)
    );
  }


  async submitOrder() {
    if (!this.selectedClient || this.orderItems.length === 0) {

      this.snackBar.openFromComponent(SnakBarComponent, {
        data: {
          message: 'Please select a customer and add at least one product',
          type: 'error'
        },
        duration: 3000,

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

        this.snackBar.openFromComponent(SnakBarComponent, {
          data: {
            message: 'Oders submited successfully !',
            type: 'success'
          },
          duration: 3000
        });
         this.notifService.getNotifications(); 
        this.showPaymentButton = true;
        this.resetCart();
       
      } catch (err: any) {
        console.error('Error submitting order item:', err);

        // Extraction du message d'erreur du backend
        const errorMessage =
          err?.error?.message || err?.error?.error || err?.message || 'Error while submitting order. Please try again.';

        this.snackBar.openFromComponent(SnakBarComponent, {
          data: {
            message: errorMessage,
            type: 'error'
          },
          duration: 3000,

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

  onQtyChangeInCart(index: number) {
    const item = this.orderItems[index];

    // Vérifie que la quantité est valide
    if (item.qty <= 0) {
      this.snackBar.openFromComponent(SnakBarComponent, {
        data: {
          message: 'Error, quantity must be at least 1.',
          type: 'error'
        },
        duration: 3000,
      });
      item.qty = 1;
    } else if (item.qty > item.qtyAvailable) {
      this.snackBar.openFromComponent(SnakBarComponent, {
        data: {
          message: 'Only ' + item.qtyAvailable + ' in stock',
          type: 'error'
        },
        duration: 3000,
      });
      item.qty = item.qtyAvailable;
    }

    // Recalcule les montants ligne
    item.price = item.unitPrice; // prix unitaire
    const totalPrice = item.qty * item.unitPrice;

    item.tax = totalPrice * 0.2;  // taxe sur la ligne
    item.discount = this.getDiscount(item.qty, item.unitPrice);
    item.amount = totalPrice + item.tax - item.discount;

    // Recalcule les totaux globaux de la commande
    this.calculateTotals();
  }

  calculateTotals(): void {
    this.amount = 0;
    for (const item of this.orderItems) {
      const validQty = item.qty && item.qty > 0 ? item.qty : 0;
      this.amount += item.price * validQty;
    }
    this.tax = this.amount * 0.2;
    this.discount = this.amount * 0.05;
  }

}
