import { Component, OnInit } from '@angular/core';
import { StockService } from '../services/stock.service';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { forkJoin } from 'rxjs';

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


  
filteredProducts: any[] = []; // données filtrées à afficher


  public customers: any;
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
    this.filteredProducts = [...this.recentProducts];
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

  /*stats = [
  { icon: 'inventory_2', title: 'Total Products', value: 124, color: '#3f51b5' },
  { icon: 'category', title: 'Categories', value: 8, color: '#f44336' },
  { icon: 'shopping_cart', title: 'Orders', value: 53, color: '#ff9800' },
  { icon: 'people', title: 'Suppliers', value: 12, color: '#4caf50' },
  { icon: 'inventory', title: 'New Products', value: 77, color: '#9c27b0' },
  { icon: 'group', title: 'New Customers', value: 99, color: '#00bcd4' }
];*/

loadStats(): void {
  forkJoin({
    productsData: this.stockService.getProductsList(),
    ordersData: this.stockService.getCreatedOrders("COMPLETED"),
    customersData: this.stockService.getCustomersList()
  }).subscribe((res: StatsResponse) => {
    this.stats = [
      { icon: 'inventory_2', title: 'Total Products', value: res.productsData.length, color: '#3f51b5' },
      { icon: 'category', title: 'Categories', value: this.countNewCategories(res.productsData), color: '#f44336' },
      { icon: 'shopping_cart', title: 'Orders', value: res.ordersData.length, color: '#ff9800' },
      { icon: 'people', title: 'Suppliers', value: 8, color: '#4caf50' },
      { icon: 'inventory', title: 'New Products', value: this.countNewProducts(res.productsData), color: '#9c27b0' },
      { icon: 'category', title: 'New Categories', value: this.countNewCategories(res.productsData), color: '#00bcd4' },
       { icon: 'group', title: 'New Customers', value: this.countNewCustomers(res.customersData), color: '#00bcd4' }
    ];
  });
}
//solution temporaire
/*countNewCustomers(customers: any[]): number {
  // simulate "new" if id > 100 for demo purposes
  return customers.filter(c => c.id > 20).length;
}

countNewProducts(products: any[]): number {
  // simulate "new" if id > 100 for demo purposes
  return products.filter(p => p.id > 20).length;
}
countCategories(products: any[]): number {
  const uniqueCategories = new Set(products.map(p => p.category));
  return uniqueCategories.size;
}*/


/*countNewCategories(categories: any[]): number {
  return categories.filter(cat => this.isToday(cat.createdDate)).length;
}

countNewProducts(products: any[]): number {
  return products.filter(p => this.isToday(p.createdDate)).length;
}*/

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




recentProducts = [
  { name: 'Wireless Mouse', category: 'Accessories', stock: 45, price: 19.99 },
  { name: 'Mechanical Keyboard', category: 'Accessories', stock: 12, price: 89.99 },
  { name: 'Office Chair', category: 'Furniture', stock: 0, price: 129.99 }
];



displayedColumns: string[] = ['name', 'category', 'stock', 'price', 'status'];

searchTerm: string = '';

applyFilter() {
  const term = this.searchTerm.toLowerCase();
  this.filteredProducts = this.recentProducts.filter(product =>
    product.name.toLowerCase().includes(term) ||
    product.category.toLowerCase().includes(term)
  );
}

}
