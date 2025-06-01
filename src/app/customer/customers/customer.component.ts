import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { StockService } from '../../services/stock.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnakBarComponent } from '../../shared/snak-bar/snak-bar.component';

@Component({
  selector: 'app-customer',
  standalone: false,

  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent implements OnInit {

  //products:Products[]=[];
  public customers: any;
  public dataSource: any;
  //customerIdEvent!:string;

  public displayedColumns = ["name", "phone", "email", "address", "status", "action"]

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private router: Router, private stockService: StockService, private activatedRoute: ActivatedRoute) {
  }

  public getCustomers() {
    this.stockService.getCustomersList().subscribe({
      next: data => {
        this.customers = data;
        this.dataSource = new MatTableDataSource(this.customers)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: err => {
        console.log(err);
      }

    });

  }
  ngOnInit(): void {

    this.getCustomers();

    this.stockService.customerUpdated$.subscribe(() => {
      this.getCustomers(); // recharge la liste

    });

    this.stockService.customerCreated$.subscribe(() => {
      this.getCustomers(); // recharge la liste

    });

  }

  filterCustomer(event: Event) {
    let value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  createCustomer() {
    this.router.navigateByUrl("/admin/create-customer");
  }

  deleteCustomer(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete this customer?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.stockService.deleteCustomer(id).subscribe({
          next: () => {
            // Suppression locale
            this.customers = this.customers.filter((c: { customerIdEvent: string; }) => c.customerIdEvent !== id);
            this.dataSource.data = this.customers;

            this.snackBar.openFromComponent(SnakBarComponent, {
              data: {
                message: 'Customer deleted successfully !',
                type: 'success'
              },
              duration: 3000
            });
          },
          error: () => {
            this.snackBar.openFromComponent(SnakBarComponent, {
              data: {
                message: 'Error while deleting customer!',
                type: 'error'
              },
              duration: 3000
            });
          }
        });
      }
    });
  }


  editCustomer(customerIdEvent: string) {
    this.router.navigate(['/admin/update-customer', customerIdEvent]);
  }


  getCustomer(customerIdEvent: string) {
    this.router.navigate(['/admin/customer-details', customerIdEvent]);
  }


}
