import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Products } from '../products';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-product',
  standalone: false,
  
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit/*, AfterViewInit*/{

  //products:Products[]=[];
  public products:any;
  public dataSource:any;
  idProduct!:number;

  public displayedColumns=["name","category","price","qty","qtyStatus","status","action"]
  
  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;
  constructor(private router:Router, private stockService:StockService,private activatedRoute:ActivatedRoute){
  }

  public getProducts(){
    this.stockService.getProductsList().subscribe({
      next: data=>{
        this.products=data;
        this.dataSource=new MatTableDataSource(this.products)
        this.dataSource.paginator=this.paginator;
        this.dataSource.sort=this.sort;
      },
      error:err=>{
        console.log(err);
      }

    });
    
  }
  ngOnInit(): void {
    this.getProducts();
   
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

  filterProduct(event:Event){
    let value=(event.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  getPayments(element:any){
    this.router.navigateByUrl("/payments")
  }

  deleteProduct(id:string){
    let conf=confirm("Are you sure ?")
    if(conf){
     this.stockService.deleteProduct(id).subscribe(data => {
      //alert("Suppression effectuée avec succés !");
       console.log(data);
       //this.ngOnInit();
       
     });
    }
    alert('Product deleted successfuly !');
    this.ngOnInit();
  }

  editProduct(productIdEvent:string){
    this.router.navigate(['/admin/update-product',productIdEvent]);
  
  }

  getProduct(productIdEvent:string){
    this.router.navigate(['/admin/product-details',productIdEvent]);
  }

  createProduct(){
    this.router.navigateByUrl("/admin/create-product");
  }

}
