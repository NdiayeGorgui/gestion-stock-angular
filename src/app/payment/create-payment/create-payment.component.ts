import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Payment } from '../payment';
import { Custom } from '../../customer/custom';
import { IModePayment } from '../IModePayment';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddConfirmDialogComponent } from '../../shared/add-confirm-dialog/add-confirm-dialog.component';
import { SnakBarComponent } from '../../shared/snak-bar/snak-bar.component';
import { TranslateService } from '@ngx-translate/core';

import { OrderResponseDto } from '../OrderResponseDto';


@Component({
  selector: 'app-create-payment',
  standalone: false,

  templateUrl: './create-payment.component.html',
  styleUrl: './create-payment.component.css'
})
export class CreatePaymentComponent implements OnInit {

order: OrderResponseDto = {
  orderId: '',
  customerName: '',
  customerEmail: '',
  amount: 0,
  totalTax: 0,
  totalDiscount: 0,
  createdDate:'',
  items: []
};


  orderId!: string;

  status = "CREATED";
  mode!: string;
  customer: Custom = new Custom();


  payment: Payment = new Payment();
  responseType: any;

 public modes: Array<{ id: number, name: string, label: string }> = [];

  constructor(private snackBar: MatSnackBar,
     private dialog: MatDialog,
     private stockService: StockService,
     private router: Router, private activatedRoute: ActivatedRoute, 
     private cdr: ChangeDetectorRef,
     private translate: TranslateService) {

  }

  modeChange(mode: string) {
    //this.mode=mode;
    // console.log(mode);
  }


ngOnInit() {
  this.orderId = this.activatedRoute.snapshot.params['orderId'];
  this.stockService.getOrderById(this.orderId).subscribe({
    next: (data: OrderResponseDto) => {
      this.order = data;
      this.payment.amount = this.order.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
    },
    error: err => {
      console.error(err);
    }
  });

  //charger dynamiquement la traduction
 this.modes = [
      { id: 1, name: 'CASH', label: '' },
      { id: 2, name: 'CHECK', label: '' },
      { id: 3, name: 'TRANSFERT', label: '' }
    ].map(mode => ({
      ...mode,
      label: this.translate.instant('payments.paymentModes.' + mode.name)
    }));
  
}


newPayment() {
 const dialogRef = this.dialog.open(AddConfirmDialogComponent, {
    data: {
      message: this.translate.instant('payment.confirm_message')
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      this.payment.orderId = this.orderId;
      this.stockService.createPayment(this.payment).subscribe({
        next: () => {
          this.snackBar.openFromComponent(SnakBarComponent, {
            data: {
              message: this.translate.instant('payment.success'),
              type: 'success'
            },
            duration: 3000
          });
          this.router.navigate(['/admin/payment']);
        },
        error: (err) => {
          console.error(err);
          this.snackBar.openFromComponent(SnakBarComponent, {
            data: {
              message: this.translate.instant('payment.error'),
              type: 'error'
            },
            duration: 3000
          });
        }
      });
    }
  });
}



 getAmount() {
  this.stockService.getOrderById(this.orderId).subscribe(
    (data: OrderResponseDto) => {
      console.log("✅ Réponse API :", data);

      // On suppose que `data.amount`, `data.totalTax`, `data.totalDiscount` existent dans OrderResponseDto
      if (
        data.amount !== undefined &&
        data.totalTax !== undefined &&
        data.totalDiscount !== undefined
      ) {
        this.order = {
            orderId: '',
            customerName: '',
           customerEmail: '',
          amount: data.amount,
          totalTax: data.totalTax,
          totalDiscount: data.totalDiscount,
          createdDate:data.createdDate,
          items:data.items
         
        };
        this.cdr.detectChanges(); // 🔄 Détecter le changement de vue
        console.log("🎯 Montant récupéré :", this.order.amount);
      }
    },
    error => {
      console.error("❌ Erreur API :", error);
    }
  );
}



printPayment() {
  const dialogRef = this.dialog.open(AddConfirmDialogComponent, {
    data: {
      message: this.translate.instant('payment.print_confirm')
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      // 1. Imprimer la facture
      this.stockService.printInvoice(this.orderId, this.status).subscribe({
        next: (response) => {
          const fileName = `Facture_${this.orderId}.xlsx`;
          this.saveExcelFile(response, fileName);

          // 2. Créer le paiement
          this.payment.orderId = this.orderId;
          this.stockService.createPayment(this.payment).subscribe({
            next: () => {
              this.snackBar.openFromComponent(SnakBarComponent, {
                data: {
                  message: this.translate.instant('payment.success_invoice'),
                  type: 'success'
                },
                duration: 3000
              });
              this.router.navigate(['/admin/payment']);
            },
            error: err => {
              console.error('Error creating payment:', err);
              this.snackBar.openFromComponent(SnakBarComponent, {
                data: {
                  message: this.translate.instant('payment.error_create'),
                  type: 'error'
                },
                duration: 3000
              });
            }
          });
        },
        error: err => {
          console.error('Error printing invoice:', err);
          this.snackBar.openFromComponent(SnakBarComponent, {
            data: {
              message: this.translate.instant('payment.error_invoice'),
              type: 'error'
            },
            duration: 3000
          });
        }
      });
    }
  });
}



  exportToExcel(data: any[], fileName: string): void {
    // Convertir les données en feuille Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'Sheet1': worksheet }, SheetNames: ['Sheet1'] };

    // Générer le fichier Excel
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Sauvegarde du fichier
    this.saveExcelFile(excelBuffer, fileName);
  }

  private saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `${fileName}.xlsx`);
  }

  goBack() {
    this.router.navigate(['/admin/order']);
    //window.location.href = '/admin/order';  // Redirection forcée
  }

   close(): void {
    this.router.navigate(['/admin/order']);
  }

}
