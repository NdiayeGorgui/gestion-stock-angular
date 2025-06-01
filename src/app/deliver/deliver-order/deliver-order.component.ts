import { Component, OnInit } from '@angular/core';
import { Deliverd } from '../Delivered';
import { StockService } from '../../services/stock.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddConfirmDialogComponent } from '../../shared/add-confirm-dialog/add-confirm-dialog.component';
import { SnakBarComponent } from '../../shared/snak-bar/snak-bar.component';

@Component({
  selector: 'app-deliver-order',
  standalone: false,

  templateUrl: './deliver-order.component.html',
  styleUrl: './deliver-order.component.css'
})
export class DeliverOrderComponent implements OnInit {

  delivered: Deliverd = new Deliverd();
  orderId!: string;

  constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private stockService: StockService, private router: Router, private activatedRoute: ActivatedRoute) {

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
    const dialogRef = this.dialog.open(AddConfirmDialogComponent, {
      data: { message: 'Do you want to confirm delivery of this order?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.stockService.createDeliveredCommand(this.delivered).subscribe({
          next: (res) => {
            console.log('Réponse du serveur:', res);
            this.snackBar.openFromComponent(SnakBarComponent, {
              data: {
                message: 'Order delivered successfully !',
                type: 'success'
              },
              duration: 3000
            });

            this.router.navigate(['/admin/delivered-orders'])
              .then(success => console.log('Navigation réussie:', success))
              .catch(err => console.error('Erreur de navigation:', err));
          },
          error: (err) => {
            console.error('Error:', err);
           this.snackBar.openFromComponent(SnakBarComponent, {
              data: {
                message: 'Error while delivering order, please try again !',
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
