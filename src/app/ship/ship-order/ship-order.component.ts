import { Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Ship } from '../Ship';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AddConfirmDialogComponent } from '../../shared/add-confirm-dialog/add-confirm-dialog.component';

@Component({
  selector: 'app-ship-order',
  standalone: false,
  
  templateUrl: './ship-order.component.html',
  styleUrl: './ship-order.component.css'
})
export class ShipOrderComponent implements OnInit {
   ship:Ship=new Ship();
   orderId!:string;

   constructor(private snackBar: MatSnackBar,private dialog: MatDialog,private stockService:StockService,private router:Router,private activatedRoute:ActivatedRoute){
  
      }

  ngOnInit(): void {
    this.orderId=this.activatedRoute.snapshot.params['orderId'];

    this.stockService.getShipById(this.orderId).subscribe({
      next:data=>{
       this.ship=data;
      },error:err=>{
       console.log(err);
     }
     });
    
   
  }

  newShip() {
    const dialogRef = this.dialog.open(AddConfirmDialogComponent, {
      data: { message: 'Do you want to confirm shipment of this order?' }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.stockService.createShip(this.ship).subscribe({
          next: (res) => {
            console.log('Réponse du serveur:', res);
            this.snackBar.open('Order shipped successfully!', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });
  
            this.router.navigate(['/admin/shipped-orders'])
              .then(success => console.log('Navigation réussie:', success))
              .catch(err => console.error('Erreur de navigation:', err));
          },
          error: (err) => {
            console.error('Error:', err);
            this.snackBar.open('Error while shipping order. Please try again.', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
          }
        });
      }
    });
  }
  
}
