import { Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { Products } from '../products';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-product',
  standalone: false,
  
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css'
})
export class UpdateProductComponent implements OnInit {

  product:Products=new Products();
  productIdEvent!:string;
 constructor(private stockService:StockService,private activatedRoute:ActivatedRoute,private router:Router){

  }
  ngOnInit(): void {

    this.productIdEvent=this.activatedRoute.snapshot.params['productIdEvent'];

    this.stockService.getProductById(this.productIdEvent).subscribe({
     next:data=>{
      this.product=data;
     },error:err=>{
      console.log(err);
    }
    });
    
  }

  updateProduct(){
    this.stockService.updateProduct(this.productIdEvent,this.product).subscribe({
      next:data=>{
        alert("Product updated successfuly!");
       },error:err=>{
        console.log(err);
      }
      });
      alert('Product updated successfuly !');
      this.router.navigateByUrl("/admin/product");
  }
 
}
