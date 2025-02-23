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

 newProduct() {
  if (!this.product.name || !this.product.category || this.product.price == null || this.product.qty == null) {
    alert('Veuillez remplir tous les champs requis.');
    return;
  }

  this.stockService.createProduct(this.product).subscribe({
    next: (prod) => {
      alert('Product saved successfully!');
      this.router.navigate(['/admin/product']);
    },
    error: (err) => {
      console.error('Erreur lors de l\'ajout du produit:', err);
      alert('Erreur lors de l\'ajout du produit. Veuillez réessayer.');
    }
  });
}


  onSubmit(){
 
    this.newProduct();
  }

}
