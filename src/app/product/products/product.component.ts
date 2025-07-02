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
public products: ProductDto[] = [];
  public dataSource = new MatTableDataSource<ProductDto>([]);
  public isLoading = true;
  public isAdmin = false;

  public displayedColumns = ["name", "category", "price", "qty", "qtyStatus", "status", "action"];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private authService: AuthenticationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private stockService: StockService,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.getProducts();

    this.stockService.productUpdated$.subscribe(() => this.getProducts());
    this.stockService.productCreated$.subscribe(() => this.getProducts());
  }

  ngAfterViewInit(): void {
    // Attache paginator et sort à la table une fois la vue initialisée
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public getProducts(): void {
    this.isLoading = true;

    this.stockService.getProductsList().subscribe({
      next: data => {
        this.products = data;
        this.dataSource.data = this.products;
        this.isLoading = false;
      },
      error: err => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  filterProduct(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  deleteProduct(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: this.translate.instant('product.delete_confirm') }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.stockService.deleteProduct(id).subscribe({
          next: () => {
            this.products = this.products.filter(p => p.productIdEvent !== id);
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

  editProduct(productIdEvent: string): void {
    this.router.navigate(['/admin/update-product', productIdEvent]);
  }

  getProduct(productIdEvent: string): void {
    this.router.navigate(['/admin/product-details', productIdEvent]);
  }

  createProduct(): void {
    this.router.navigateByUrl("/admin/create-product");
  }

}
