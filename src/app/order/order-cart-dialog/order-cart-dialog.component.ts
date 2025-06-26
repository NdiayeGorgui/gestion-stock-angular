import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-order-cart-dialog',
  standalone: false,
  templateUrl: './order-cart-dialog.component.html',
  styleUrl: './order-cart-dialog.component.css'
})
export class OrderCartDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<OrderCartDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  close(): void {
    this.dialogRef.close();
  }

  // ➤ 1. Sous-total (brut sans remises ni taxe)
  getTotalPrice(): number {
    const subtotal = this.data.orderItems.reduce((sum: number, item: any) => sum + item.price * item.qty, 0);
    return Math.round(subtotal * 100) / 100;
  }

  // ➤ 2. Remise selon les mêmes règles que le backend
  getTotalDiscount(): number {
    const discount = this.data.orderItems.reduce((sum: number, item: any) => {
      const total = item.price * item.qty;
      if (total < 100) return sum;
      else if (total < 200) return sum + (0.005 * total);
      else return sum + (0.01 * total);
    }, 0);
    return Math.round(discount * 100) / 100;
  }

  // ➤ 3. TVA de 20% appliquée sur le montant après remise
  getTotalTax(): number {
    const taxable = this.getTotalPrice() - this.getTotalDiscount();
    const tax = taxable * 0.20;
    return Math.round(tax * 100) / 100;
  }

  // ➤ 4. Montant total à payer
  getTotalAmount(): number {
    const total = (this.getTotalPrice() - this.getTotalDiscount()) + this.getTotalTax();
    return Math.round(total * 100) / 100;
  }

  // Actions
  submitOrder() {
    this.dialogRef.close({ placeOrder: true }); // fermeture avec validation
  }

  cancel() {
    this.dialogRef.close(); // fermeture sans validation
  }
}
