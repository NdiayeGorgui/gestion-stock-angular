import { Component, OnInit } from '@angular/core';
import { StockService } from '../services/stock.service';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

interface StatsResponse {
  productsData: any[];
  ordersData: any[];
  customersData: any[];
}


@Component({
  selector: 'app-dashboard',
  standalone: false,

  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

public isLoading = true;


  filteredProducts: any[] = []; // données filtrées à afficher


  public customers: any;
  public productStatsData: any;
  public products: any;
  public mostOrderedProducts: any;
  public mostOrderedCustomers: any;
  legendPosition: LegendPosition = LegendPosition.Below;


  stats: any[] = [];

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
    this.loadStats();
    this.getMostOrderedProducts();
    this.getTop10CustomersMostOrdered();
    this.getProducts();
    this.setBarChartWidth();
    //this.filteredProducts = [...this.recentProducts];
    this.stockService.getProductsList().subscribe(products => {
      this.products = products;

      this.filteredProducts = this.getTop10LatestProducts(products);
    });


  }
  constructor(private stockService: StockService, private translate: TranslateService) {

  }
  public getCustomers() {
    this.stockService.getCustomersList().subscribe({
      next: data => {
        this.customers = data;
       this.isLoading = false;

      },
      error: err => {
        console.log(err);
        this.isLoading = false;

      }

    });

  }

  public getProducts() {
    this.stockService.getProductsList().subscribe({
      next: data => {
        // Transformer les données pour respecter le format attendu par ngx-charts
        this.productStatsData = data.map(item => ({
          name: item.name,
          value: item.qty // Changer totalQuantite en value
        }));

        console.log(this.mostOrderedProducts); // Vérifier que les données sont correctes
        this.isLoading = false;

      },
      error: err => {
        console.log(err);
        this.isLoading = false;

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
        this.isLoading = false;

      },
      error: err => {
        console.log(err);
        this.isLoading = false;

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
        this.isLoading = false;

      },
      error: err => {
        console.log(err);
        this.isLoading = false;

      }
    });
  }

  loadStats(): void {
    forkJoin({
      productsData: this.stockService.getProductsList(),
      ordersData: this.stockService.getCreatedOrders("COMPLETED"),
      customersData: this.stockService.getCustomersList()
    }).subscribe((res: StatsResponse) => {
      console.log('First order:', res.ordersData[0]);


      this.stats = [
        {
          icon: 'inventory_2',
          title: this.translate.instant('dashboard.TOTAL_PRODUCTS'),
          value: res.productsData.length,
          color: '#3f51b5'
        },
        {
          icon: 'category',
          title: this.translate.instant('dashboard.CATEGORIES'),
          value: this.countNewCategories(res.productsData),
          color: '#f44336'
        },
        {
          icon: 'shopping_cart',
          title: this.translate.instant('dashboard.ORDERS'),
          value: res.ordersData.length,
          color: '#ff9800'
        },
        {
          icon: 'people',
          title: this.translate.instant('dashboard.SUPPLIERS'),
          value: 8,
          color: '#4caf50'
        },
        {
          icon: 'inventory',
          title: this.translate.instant('dashboard.NEW_PRODUCTS'),
          value: this.countNewProducts(res.productsData),
          color: '#9c27b0'
        },
        {
          icon: 'category',
          title: this.translate.instant('dashboard.NEW_CATEGORIES'),
          value: this.countNewCategories(res.productsData),
          color: '#00bcd4'
        },
        {
          icon: 'group',
          title: this.translate.instant('dashboard.NEW_CUSTOMERS'),
          value: this.countNewCustomers(res.customersData),
          color: '#00bcd4'
        },
        {
          icon: 'add_shopping_cart',
          title: this.translate.instant('dashboard.NEW_ORDERS'),
          value: this.countNewOrders(res.ordersData),
          color: '#e91e63'
        }

      ];
     this.isLoading = false;

    });
  }
  


  isToday(date: string): boolean {
    const today = new Date().toISOString().slice(0, 10);
    return date?.slice(0, 10) === today;
  }

  countNewProducts(products: any[]): number {
    return products.filter(p => this.isInLast7Days(p.createdDate)).length;
  }
  countNewCategories(products: any[]): number {
    const recentProducts = products.filter(p => this.isInLast7Days(p.createdDate));
    const uniqueCategories = new Set(recentProducts.map(p => p.category));
    return uniqueCategories.size;
  }

  countNewCustomers(customers: any[]): number {
    return customers.filter(c => this.isInLast7Days(c.createdDate)).length;
  }
  countNewOrders(orders: any[]): number {
  return orders.filter(o => this.isInLast7Days(o.createdDate)).length;
}


  isInLast7Days(dateStr: string): boolean {
    if (!dateStr) return false;

    const original = new Date(dateStr);
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    // Corriger GMT en GMT-4
    const adjusted = new Date(original.getTime() - 4 * 60 * 60 * 1000);

    const inRange = adjusted >= sevenDaysAgo && adjusted <= now;
    console.log(`Date: ${adjusted.toISOString()} -> InLast7Days: ${inRange}`);
    return inRange;
  }

  getTop10LatestProducts(products: any[]): any[] {
    const sorted = [...products].sort((a, b) =>
      new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
    );

    return sorted.slice(0, 10);
  }


  getLatestByStockStatus(products: any[]): any[] {
    const withDate = products.filter(p => p.createdDate);
    console.log("Produits avec date:", withDate);

    const sorted = [...withDate].sort((a, b) =>
      new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
    );

    const latestOutOfStock = sorted.find(p => p.qty === 0);
    const latestLowStock = sorted.find(p => p.qty > 0 && p.qty < 10);
    const latestInStock = sorted.find(p => p.qty >= 10);

    console.log("OUT:", latestOutOfStock, "LOW:", latestLowStock, "IN:", latestInStock);

    return [latestOutOfStock, latestLowStock, latestInStock].filter(p => p);
  }


  displayedColumns: string[] = ['name', 'category', 'stock', 'price', 'status', 'createdDate'];

  searchTerm: string = '';

  applyFilter() {
    const term = this.searchTerm.toLowerCase();
    const latest = this.getTop10LatestProducts(this.products);

    this.filteredProducts = latest.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    );
  }

}
