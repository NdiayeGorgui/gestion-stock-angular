import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Order } from '../order';
import { StockService } from '../../services/stock.service';
import { Router } from '@angular/router';
import { Customer } from '../customer';
import { Product } from '../product';
import { ProductItem } from '../productItem';
import { OrderEvent } from '../orders/orderEvent';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Custom } from '../../customer/custom';
import { Products } from '../../product/products';


@Component({
  selector: 'app-create-order',
  standalone: false,
  
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})


export class CreateOrderComponent implements OnInit {
  discount: number = 0;
  tax: number = 0;
  amount: number = 0;
  totalCartAmount: number = 0;

  

  status='CREATED';
  customer:Custom=new Custom();
  product:Product=new Product();
  productItem:ProductItem=new ProductItem();
    

    customerIdEvent!:string;
    id!:string;
    productIdEvent!:string;
   
    public customers:any;
    public products:any;
    public orders:any;
   
    orderEvent:any= {
      customer:{},
      product:{},
      productItem:{}
    };

    selectedCustomerId: string = '';
    selectedCustomer: Custom | null = null;

    selectedProductId: string = '';
    selectedProduct: Products | null = null;
    
    constructor(private stockService:StockService,private router:Router){

    }

    goToPayment(){
      this.router.navigate(['/admin/order']);
    }
  
    ngOnInit(): void {
      this.getCustomers();
      this.getProducts();
      this.getOrders();
     
    }

   

    cartCount: number = 0;  // Initialisation du compteur
    isCardButtonEnabled: boolean = false;  // Désactivé par défaut

    newOrder() {
      if (!this.orderEvent.customer.customerIdEvent || 
          !this.orderEvent.product.productIdEvent || 
          !this.orderEvent.productItem.productQty) {
        alert('Please fill in all required fields.');
        return;
      }
    
      this.stockService.createOrder(this.orderEvent).subscribe({
        
        next: (prod) => {
          console.log(prod);
          alert('Order saved successfully!');
          // ✅ Ajout du montant de la commande au total du panier
          this.totalCartAmount += this.amount; 
          this.router.navigate(['/admin/create-order']);
           // ✅ Navigation après le succès de l'opération
          
           this.cartCount++; // Incrémente le compteur à chaque ajout d'une commande
           this.isCardButtonEnabled = true; // Active le bouton "Card"
           


          // this.ngOnInit();
          
    
          // Réinitialiser le formulaire après ajout
        /*  this.orderEvent = {
            customer: { customerIdEvent: null },
            product: { productIdEvent: null },
            productItem: { productQty: null }
           
          };*/
    
         
        },
        error: (err) => {
          console.log(err);
          alert('Error while saving order.');
        }
      }); 
      
    }
    

  
    public getCustomers(){
      this.stockService.getCustomersOrderList().subscribe({
        next: data=>{
          this.customers=data;
         
        },
        error:err=>{
          console.log(err);
        }
  
      });
      
    }

    public getOrders(){
      this.stockService.getCreatedOrders(this.status).subscribe({
        next: data=>{
          this.orders=data;
          
        },
        error:err=>{
          console.log(err);
        }
  
      });
      
    }

    public getProducts(){
      this.stockService.getProductsOrderList().subscribe({
        next: data=>{
          this.products=data;
         
        },
        error:err=>{
          console.log(err);
        }
  
      });
      this.selectedProductId = '';
    }

    onCustomerChange(customerId:string) {
     
      console.log('🔄 onCustomerChange() triggered!'); // Test si la méthode est appelée
      if (customerId) { 
        this.selectedCustomerId = customerId;
        
        console.log('📌 Selected Customer ID:', this.selectedCustomerId); // Vérifie la valeur
        this.stockService.getCustomerOrderById(this.selectedCustomerId).subscribe(custom => {
          console.log('Customer data received:', custom); // Debug console
          this.selectedCustomer = custom;
         // this.customer.id=this.selectedCustomerId;
          this.orderEvent.customer.customerIdEvent=this.selectedCustomerId;
          this.customer.customerIdEvent=this.selectedCustomerId;

          console.log('📌 Selected CustomerIdEvent:', this.customer.customerIdEvent);
          
        }, error => {
          console.error('Erreur lors de la récupération du client', error);
        });
      }else {
        console.warn('⚠️ selectedCustomerId est vide !');
      }
     
        }

        onProductChange(productId:string) {

         
          if (productId) {
            this.selectedProductId=productId;
        
            this.stockService.getProductOrderById(this.selectedProductId).subscribe(product => {
              console.log('product data received:', product); // Debug console
              this.selectedProduct = product;
              this.orderEvent.product.productIdEvent=this.selectedProductId;
              this.product.productIdEvent=this.selectedProductId;
              this.calculateAmount(); // 🔥 Recalcul du montant dès qu'un produit est sélectionné
              
            }, error => {
              console.error('Erreur lors de la récupération du produit', error);
            });
          }else {
            console.warn('⚠️ selectedProductId est vide !');
          }
         
            }
            onQuantityChange() {
              this.calculateAmount();
            }
            
            calculateAmount() {
              if (this.selectedProduct && this.orderEvent.productItem.productQty > 0) {
                const price: number = Number(this.selectedProduct.price); // ✅ Conversion explicite en `number`
                const qty: number = Number(this.orderEvent.productItem.productQty);
            
                const total: number = qty * price;
                this.tax = total * 0.2; // 20% de taxe
            
                // Application de la remise en fonction du total
                if (total < 100) {
                  this.discount = 0;
                } else if (total < 200) {
                  this.discount = 0.005 * total; // 0.5% de remise
                } else {
                  this.discount = 0.01 * total; // 1% de remise
                }
            
                this.amount = total + this.tax - this.discount;
              } else {
                this.tax = 0;
                this.discount = 0;
                this.amount = 0;
              }
            }
            
            
}
