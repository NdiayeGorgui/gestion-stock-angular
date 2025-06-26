import { Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Ship } from '../Ship';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AddConfirmDialogComponent } from '../../shared/add-confirm-dialog/add-confirm-dialog.component';
import { SnakBarComponent } from '../../shared/snak-bar/snak-bar.component';
import { TranslateService } from '@ngx-translate/core';
import { ShipResponseDto } from '../ShipResponseDto';
import { MatTableDataSource } from '@angular/material/table';
import { ProductItemResponseDto } from '../../payment/ProductItemResponseDto';

@Component({
  selector: 'app-ship-order',
  standalone: false,

  templateUrl: './ship-order.component.html',
  styleUrl: './ship-order.component.css'
})
export class ShipOrderComponent implements OnInit {
  ship: ShipResponseDto = {
     orderId: '',
     paymentIdEvent: '',
     customerName: '',
     customerMail: '',
     amount: 0,
     totalTax: 0,
     totalDiscount: 0,
     shippingStatus: '',
     eventTimeStamp: new Date(),
     products: []  // 
   };
  orderId!: string;

  dataSource = new MatTableDataSource<ProductItemResponseDto>([]);
  displayedColumns: string[] = ['productId', 'productName', 'quantity', 'price', 'discount', 'tax'];

  constructor(private snackBar: MatSnackBar, private dialog: MatDialog,
     private stockService: StockService,
      private router: Router, private activatedRoute: ActivatedRoute,
     private translate: TranslateService) {

  }

  ngOnInit(): void {
    this.orderId = this.activatedRoute.snapshot.params['orderId'];

    this.stockService.getShipById(this.orderId).subscribe({
      next: data => {
        this.ship = data;
         this.dataSource.data = data.products;
        console.log('✅ Données chargées :', data);
      }, error: err => {
        console.log(err);
      }
    });


  }

newShip() {
  const dialogRef = this.dialog.open(AddConfirmDialogComponent, {
    data: { message: this.translate.instant('newShipping.confirm_shipment') }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      this.stockService.createShip(this.ship).subscribe({
        next: (res) => {
          console.log('Réponse du serveur:', res);
          this.snackBar.openFromComponent(SnakBarComponent, {
            data: {
              message: this.translate.instant('newShipping.ship_success'),
              type: 'success'
            },
            duration: 3000
          });

          this.router.navigate(['/admin/shipped-orders'])
            .then(success => console.log('Navigation réussie:', success))
            .catch(err => console.error('Erreur de navigation:', err));
        },
        error: (err) => {
          console.error('Error:', err);
          this.snackBar.openFromComponent(SnakBarComponent, {
            data: {
              message: this.translate.instant('newShipping.ship_error'),
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
