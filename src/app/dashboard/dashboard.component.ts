import { Component, OnInit } from '@angular/core';
import { StockService } from '../services/stock.service';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
@Component({
  selector: 'app-dashboard',
  standalone: false,

  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  public customers: any;
  public products: any;
  public mostOrderedProducts: any;
  public mostOrderedCustomers: any;
  legendPosition: LegendPosition = LegendPosition.Below;



  colorScheme: Color = {
    domain: ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F6'],
    name: 'Custom Colors',
    selectable: true,
    group: ScaleType.Time
  };
  barChartWidth!: number;

  setBarChartWidth() {
    const baseWidth = 800;
    const barWidth = 60;
    const productCount = this.products?.length || 0;

    this.barChartWidth = Math.max(baseWidth, productCount * barWidth);
  }

  ngOnInit(): void {
    this.getMostOrderedProducts();
    this.getTop10CustomersMostOrdered();
    this.getProducts();
    this.setBarChartWidth();
  }
  constructor(private stockService: StockService) {

  }
  public getCustomers() {
    this.stockService.getCustomersList().subscribe({
      next: data => {
        this.customers = data;

      },
      error: err => {
        console.log(err);
      }

    });

  }

  public getProducts() {
    this.stockService.getProductsList().subscribe({
      next: data => {
        // Transformer les données pour respecter le format attendu par ngx-charts
        this.products = data.map(item => ({
          name: item.name,
          value: item.qty // Changer totalQuantite en value
        }));

        console.log(this.mostOrderedProducts); // Vérifier que les données sont correctes
      },
      error: err => {
        console.log(err);
      }
    });

  }

  public getMostOrderedProducts() {
    this.stockService.getMostOrderedProducts().subscribe({
      next: data => {
        // Transformer les données pour respecter le format attendu par ngx-charts
        this.mostOrderedProducts = data.map(item => ({
          name: item.name,
          value: item.totalQuantite // Changer totalQuantite en value
        }));

        console.log(this.mostOrderedProducts); // Vérifier que les données sont correctes
      },
      error: err => {
        console.log(err);
      }
    });
  }

  public getTop10CustomersMostOrdered() {
    this.stockService.getTop10CustomerMostOrdered().subscribe({
      next: data => {
        // Transformer les données pour respecter le format attendu par ngx-charts
        this.mostOrderedCustomers = data.map(item => ({
          name: item.name,
          value: item.totalOrder // Changer totalOrder en value
        }));

        console.log(this.mostOrderedProducts); // Vérifier que les données sont correctes
      },
      error: err => {
        console.log(err);
      }
    });
  }

}
