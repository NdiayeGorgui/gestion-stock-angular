import { Component, OnInit, signal } from '@angular/core';
import { Custom } from '../custom';
import { StockService } from '../../services/stock.service';
import { ActivatedRoute, Router } from '@angular/router';
import { merge } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddConfirmDialogComponent } from '../../shared/add-confirm-dialog/add-confirm-dialog.component';
import { SnakBarComponent } from '../../shared/snak-bar/snak-bar.component';

@Component({
  selector: 'app-update-customer',
  standalone: false,

  templateUrl: './update-customer.component.html',
  styleUrl: './update-customer.component.css'
})
export class UpdateCustomerComponent implements OnInit {

  readonly email = new FormControl('', [Validators.required, Validators.email]);

  errorMessage = signal('');

  customer: Custom = new Custom();
  customerIdEvent!: string;
  constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private stockService: StockService, private activatedRoute: ActivatedRoute, private router: Router) {
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

    this.customerIdEvent = this.activatedRoute.snapshot.params['customerIdEvent'];

    this.stockService.getCustomerById(this.customerIdEvent).subscribe({
      next: data => {
        this.customer = data;
      }, error: err => {
        console.log(err);
      }
    });

  }

  updateCustomer() {
    if (!this.customer.name || !this.customer.email || !this.customer.phone) {
       this.snackBar.openFromComponent(SnakBarComponent, {
                  data: {
                    message: 'Please fill in all required fields !',
                    type: 'error'
                  },
                  duration: 3000
                });
      return;
    }

    const dialogRef = this.dialog.open(AddConfirmDialogComponent, {
      data: { message: 'Do you want to update this customer ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.stockService.updateCustomer(this.customerIdEvent, this.customer).subscribe({
          next: (data) => {
             this.snackBar.openFromComponent(SnakBarComponent, {
                              data: {
                                message: 'Customer udated successfully!',
                                type: 'success'
                              },
                              duration: 3000
                            });
            this.stockService.notifyCustomerUpdated(); // 🚀 Notifie les observateurs

            this.router.navigate(['/admin/customer']);
          },
          error: (err) => {
            console.error('Error while updating customer :', err);
             this.snackBar.openFromComponent(SnakBarComponent, {
                  data: {
                    message: 'Error while updating Customer, please try again !',
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


