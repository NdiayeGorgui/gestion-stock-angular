import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { StockService } from '../../services/stock.service';
import { MatTableDataSource } from '@angular/material/table';
import { OrderEventDto } from '../OrderEventDTo';

@Component({
  selector: 'app-order-events',
  standalone: false,

  templateUrl: './order-events.component.html',
  styleUrl: './order-events.component.css'
})
export class OrderEventsComponent implements OnInit {
  public isLoading = true;

 public orderEvents: OrderEventDto[] = [];
dataSource = new MatTableDataSource<OrderEventDto>([]);

  //customerIdEvent!:string;

  public displayedColumns = ["orderId", "customerId", "status", "details", "eventTimeStamp"]

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private router: Router, private stockService: StockService, private activatedRoute: ActivatedRoute) {
  }



  public getOderEvents() {
    this.stockService.getOrderEventSourcingList().subscribe({
      next: data => {
        this.orderEvents = data;
        this.dataSource = new MatTableDataSource(this.orderEvents)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;

      },
      error: err => {
        console.log(err);
        this.isLoading = false;

      }

    });

  }
  ngOnInit(): void {

    this.getOderEvents();

  }


  filterOrderEvents(event: Event) {
    let value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }


}
