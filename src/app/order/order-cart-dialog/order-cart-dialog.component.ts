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



  getTotalPrice(): number {
    return this.data.orderItems.reduce((sum: number, item: any) => sum + item.price * item.qty, 0);
  }

  getTotalTax(): number {
    return this.data.orderItems.reduce((sum: number, item: any) => sum + item.tax, 0);
  }

  getTotalDiscount(): number {
    return this.data.orderItems.reduce((sum: number, item: any) => sum + item.discount, 0);
  }

  getTotalAmount(): number {
    return this.getTotalPrice() + this.getTotalTax() - this.getTotalDiscount();
  }

  submitOrder() {
    this.dialogRef.close({ placeOrder: true }); // le parent exécutera la vraie soumission
  }

  cancel() {
    this.dialogRef.close(); // fermeture sans action
  }


}