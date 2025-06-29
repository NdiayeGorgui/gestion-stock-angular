import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Products } from '../products';
import { StockService } from '../../services/stock.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../../services/authentication.service';
import { SnakBarComponent } from '../../shared/snak-bar/snak-bar.component';
import { TranslateService } from '@ngx-translate/core';
import { ProductDto } from './ProductDto';

@Component({
  selector: 'app-product',
  standalone: false,

  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit/*, AfterViewInit*/ {

  //products:Products[]=[];
public products: ProductDto[] = [];
dataSource = new MatTableDataSource<ProductDto>([]);
public isLoading = true;

  idProduct!: number;
  isAdmin = false;

  public displayedColumns = ["name", "category", "price", "qty", "qtyStatus", "status", "action"]

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private authService: AuthenticationService,
     private snackBar: MatSnackBar,
      private dialog: MatDialog, 
      private router: Router,
       private stockService: StockService,
        private activatedRoute: ActivatedRoute,
        private translate: TranslateService) {
  }

  public getProducts() {
    this.stockService.getProductsList().subscribe({
      next: data => {
        this.products = data;
        this.dataSource = new MatTableDataSource(this.products)
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
    this.isAdmin = this.authService.isAdmin();
    this.getProducts();

    this.stockService.productUpdated$.subscribe(() => {
      this.getProducts(); // recharge la liste
    });
    this.stockService.productCreated$.subscribe(() => {
      this.getProducts(); // recharge la liste
    });


  }

  /*ngOnInit(): void {
    this.products=[
      {"id":1,"name":"computer", "qty":2,"price":2300,"status":"CREATED"},
      {"id":2,"name":"table","qty":3,"price":50,"status":"CREATED"},
      {"id":3,"name":"imprimante","qty":1,"price":90,"status":"CREATED"}
    ];
     this.dataSource=new MatTableDataSource(this.products)
  }*/

  /* ngAfterViewInit(): void {
     this.dataSource.paginator=this.paginator;
     this.dataSource.sort=this.sort;
   }*/

  filterProduct(event: Event) {
    let value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  getPayments(element: any) {
    this.router.navigateByUrl("/payments")
  }


deleteProduct(id: string) {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: {
      message: this.translate.instant('product.delete_confirm')
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      this.stockService.deleteProduct(id).subscribe({
        next: () => {
          // Suppression locale
          this.products = this.products.filter((p: { productIdEvent: string }) => p.productIdEvent !== id);
          this.dataSource.data = this.products;

          this.snackBar.openFromComponent(SnakBarComponent, {
            data: {
              message: this.translate.instant('product.delete_success'),
              type: 'success'
            },
            duration: 3000
          });
        },
        error: () => {
          this.snackBar.openFromComponent(SnakBarComponent, {
            data: {
              message: this.translate.instant('product.delete_error'),
              type: 'error'
            },
            duration: 3000
          });
        }
      });
    }
  });
}



  editProduct(productIdEvent: string) {
    this.router.navigate(['/admin/update-product', productIdEvent]);

  }

  getProduct(productIdEvent: string) {
    this.router.navigate(['/admin/product-details', productIdEvent]);
  }

  createProduct() {
    this.router.navigateByUrl("/admin/create-product");
  }

}
