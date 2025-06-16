import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Payment } from '../payment';
import { Custom } from '../../customer/custom';
import { IModePayment } from '../IModePayment';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { AmountDto } from './amountDto';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddConfirmDialogComponent } from '../../shared/add-confirm-dialog/add-confirm-dialog.component';
import { SnakBarComponent } from '../../shared/snak-bar/snak-bar.component';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-create-payment',
  standalone: false,

  templateUrl: './create-payment.component.html',
  styleUrl: './create-payment.component.css'
})
export class CreatePaymentComponent implements OnInit {

  amountDto: AmountDto = { amount: 0, totalAmount: 0, tax: 0, discount: 0 };  // Défaut pour éviter undefined

  customerIdEvent!: string;

  status = "CREATED";
  mode!: string;
  customer: Custom = new Custom();


  payment: Payment = new Payment();
  responseType: any;

  public modes: Array<IModePayment> = [{ id: 1, name: 'CASH' },
  { id: 2, name: 'CHECK' },
  { id: 3, name: 'TRANSFERT' }];

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

  ngOnInit(): void {
    this.customerIdEvent = this.activatedRoute.snapshot.params['customerIdEvent'];
    this.stockService.getCustomerById(this.customerIdEvent).subscribe({
      next: data => {
        this.customer = data;
        this.getAmount();
      }, error: err => {
        console.log(err);
      }
    });
  }

newPayment() {
  const dialogRef = this.dialog.open(AddConfirmDialogComponent, {
    data: {
      message: this.translate.instant('payment.confirm_message')
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      this.payment.customerIdEvent = this.customerIdEvent;
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
    this.stockService.getAmount(this.customerIdEvent, this.status).subscribe(
      (data: AmountDto) => {
        console.log("✅ Réponse API :", data);

        if (data && data.amount !== undefined && data.totalAmount !== undefined && data.tax !== undefined && data.discount !== undefined) {
          this.amountDto = data;
          this.cdr.detectChanges(); // 🔹 Force Angular à voir le changement
          console.log("🎯 Montant récupéré :", this.amountDto.amount);
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
      this.stockService.printInvoice(this.customerIdEvent, this.status).subscribe({
        next: (response) => {
          const fileName = `Facture_${this.customerIdEvent}.xlsx`;
          this.saveExcelFile(response, fileName);

          // 2. Créer le paiement
          this.payment.customerIdEvent = this.customerIdEvent;
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

}
