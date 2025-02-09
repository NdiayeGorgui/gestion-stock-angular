import { Component, OnInit } from '@angular/core';
import { Products } from '../products';
import { StockService } from '../../services/stock.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-product',
  standalone: false,
  
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css'
})
export class CreateProductComponent implements OnInit{

  product:Products=new Products();

  constructor(private stockService:StockService, private router:Router){

  }
  ngOnInit(): void {
    
  }
  goToProductList(){
   // this.router.navigate(['/admin/product']);
   this.router.navigateByUrl("/admin/create-product");
 }

  newProduct(){
    this.stockService.createProduct(this.product).subscribe({
      next:prod=>{
       // alert('Product saved successfuly !');
       // this.goToProductList();
      },
      error:err=>{
        console.log(err);
      }
   
    });
    alert('Product saved successfuly !');
    this.router.navigate(['/admin/product']);
  }

  onSubmit(){
 
    this.newProduct();
  }

}
