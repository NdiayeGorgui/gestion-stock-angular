import { Component, OnInit, ViewChild } from '@angular/core';
import { StockService } from '../../services/stock.service';

import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { OrderEvent } from './orderEvent';
import { Customer } from '../customer';
import { Product } from '../product';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddConfirmDialogComponent } from '../../shared/add-confirm-dialog/add-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnakBarComponent } from '../../shared/snak-bar/snak-bar.component';

@Component({
  selector: 'app-order',
  standalone: false,

  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {

  // oder:Order=new Order();

  customer: Customer = new Customer();
  customerId!: string;
  customerName!: string;
  customerEmail!: string;
  customerPhone!: string;
  customerAddress!: string;

  product: Product = new Product();
  productId!: string;
  productName!: string;
  productPrice!: number;
  productQty!: number;
  date!: Date;
  amount!: number;
  discount!: number;
  price!: number;
  orderIdEvent!: string;


  //productItem:ProductItem=new ProductItem();
  producItemtQty!: number;


  orderEvent: OrderEvent = new OrderEvent();
  order: OrderEvent = new OrderEvent();
  status = 'CREATED';

  public orders: any;
  public dataSource: any;
  //customerIdEvent!:string;

  productItem: any = {

    product: {},
    order: {
      customer: {}
    }
  };

  public displayedColumns = ["customerName", "productName", "price", "qty", "payment", "details", "cancel"]

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private stockService: StockService, private router: Router, private activatedRoute: ActivatedRoute) {

  }
  public getCreatedOrders() {
    this.stockService.getCreatedOrders(this.status).subscribe({
      next: data => {
        this.orders = data;
        this.orders.sort((a: any, b: any) => a.order.customer.name.localeCompare(b.order.customer.name));
        this.dataSource = new MatTableDataSource(this.orders)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: err => {
        console.log(err);
      }

    });

  }

  ngOnInit(): void {
    this.stockService.getCreatedOrders('CREATED').subscribe({
      next: data => {
        this.createdOrders = data;
        this.dataSource = new MatTableDataSource(this.createdOrders);
        this.groupOrders(); // ← APPEL INDISPENSABLE
      },
      error: err => console.error(err)
    });
  }



  getOrder(customerIdEvent: string) {
    this.router.navigate(['/admin/order-details', customerIdEvent]);
  }

  filterOrder(event: Event) {
    let value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  makePayment(customerIdEvent: string) {
    this.router.navigate(['/admin/create-payment', customerIdEvent]);
  }
  createdOrders: any[] = []; // ou OrderDTO[]

  cancelOrder(orderIdEvent: string): void {
    const dialogRef = this.dialog.open(AddConfirmDialogComponent, {
      data: {
        title: 'Are you sure?',
        message: 'This order will be permanently removed.',
        confirmText: 'Yes, delete it',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.stockService.cancelOrder(orderIdEvent).subscribe({
          next: () => {
            this.createdOrders = this.createdOrders.filter(order => order.orderIdEvent !== orderIdEvent);
            this.dataSource.data = this.createdOrders; // met à jour la table
            this.groupOrders(); // recalcul des regroupements pour rowspan
            this.snackBar.openFromComponent(SnakBarComponent, {
              data: {
                message: 'order canceled successfully !',
                type: 'success'
              },
              duration: 3000
            });
          },
          error: (err) => {
            console.error('Error cancelling order', err);
            this.snackBar.openFromComponent(SnakBarComponent, {
              data: {
                message: 'Error cancelling order!',
                type: 'error'
              },
              duration: 3000
            });
          }
        });
      }
    });
  }


  growSpanMap: Map<number, number> = new Map();

  groupOrders(): void {
    this.growSpanMap.clear();
    const map = new Map<string, number>();
    this.createdOrders.forEach((order, index) => {
      const customerId = order.order.customer.customerIdEvent;
      if (!map.has(customerId)) {
        map.set(customerId, index);
        this.growSpanMap.set(index, 1);
      } else {
        const firstIndex = map.get(customerId)!;
        this.growSpanMap.set(firstIndex, this.growSpanMap.get(firstIndex)! + 1);
        this.growSpanMap.set(index, 0); // les suivants ne s'affichent pas
      }
    });
  }

  shouldShowRowSpan(index: number): boolean {
    return this.growSpanMap.get(index)! > 0;
  }

  getRowSpan(index: number): number {
    return this.growSpanMap.get(index)!;
  }
}
