import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';
import { StockService } from '../../services/stock.service';
import { Custom } from '../custom';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AddConfirmDialogComponent } from '../../shared/add-confirm-dialog/add-confirm-dialog.component';
import { SnakBarComponent } from '../../shared/snak-bar/snak-bar.component';
import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'app-create-customer',
  standalone: false,

  templateUrl: './create-customer.component.html',
  styleUrl: './create-customer.component.css'
})
export class CreateCustomerComponent implements OnInit {
  // customerFormGroup!:FormGroup;
  customer: Custom = new Custom();

  readonly email = new FormControl('', [Validators.required, Validators.email]);

  errorMessage = signal('');

  constructor(private snackBar: MatSnackBar, private dialog: MatDialog,
     private stockService: StockService, private router: Router,private translate: TranslateService) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

  ngOnInit(): void {

  }

newCustomer() {
  if (!this.customer.name || !this.customer.address || !this.customer.phone || !this.customer.email|| !this.customer.city|| !this.customer.postalCode) {
    this.snackBar.openFromComponent(SnakBarComponent, {
      data: {
        message: this.translate.instant('customer.fill_required'),
        type: 'error'
      },
      duration: 3000
    });
    return;
  }

  this.stockService.getCustomerExistByEmail(this.customer.email).subscribe({
    next: (res) => {
      if (res.exists) {
        this.snackBar.openFromComponent(SnakBarComponent, {
          data: {
            message: this.translate.instant('customer.exists_error'),
            type: 'error'
          },
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        return;
      }

      const dialogRef = this.dialog.open(AddConfirmDialogComponent, {
        data: { message: this.translate.instant('customer.confirm_create') }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.stockService.createCustomer(this.customer).subscribe({
            next: () => {
              this.snackBar.openFromComponent(SnakBarComponent, {
                data: {
                  message: this.translate.instant('customer.create_success'),
                  type: 'success'
                },
                duration: 3000
              });

              this.stockService.notifyCustomerCreated();
              this.router.navigate(['/admin/customer']);
            },
            error: (err) => {
              console.error('Error:', err);
              this.snackBar.openFromComponent(SnakBarComponent, {
                data: {
                  message: this.translate.instant('customer.create_error'),
                  type: 'error'
                },
                duration: 3000
              });
            }
          });
        }
      });
    },
    error: (err) => {
      console.error('Error checking customer existence:', err);
      this.snackBar.openFromComponent(SnakBarComponent, {
        data: {
          message: this.translate.instant('customer.email_check_error'),
          type: 'error'
        },
        duration: 3000,
        panelClass: ['snackbar-error']
      });
    }
  });
}


}

