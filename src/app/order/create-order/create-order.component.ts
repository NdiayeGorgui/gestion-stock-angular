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
          console.log("✅ Commande créée :", prod);
          alert('Order saved successfully!');
    
          // ✅ Ajout du montant de la commande au total du panier
          this.totalCartAmount += this.amount; 
          
    
          // ✅ Navigation après succès
          this.router.navigate(['/admin/create-order']);

          // ✅ Mettre à jour la liste des commandes pour récupérer l'ID
          this.getOrdersCreatedListByCustomer();
    
          // ✅ Mise à jour du compteur du panier
          this.cartCount++; 
          this.isCardButtonEnabled = true; 
    
          // ✅ Ajouter à `orders` avec `orderIdEvent`
          this.orders.push({
            orderIdEvent: (prod as any).orderIdEvent, // ✅ Forcer l'accès à la propriété
            customer: this.selectedCustomer?.name,
            product: this.selectedProduct?.name,
            qty: this.orderEvent.productItem.productQty,
            basePrice: this.selectedProduct?.price, // 🆕
            price: this.amount,
           
            
          });
    
          // ✅ Réinitialiser les champs
          this.resetOrderForm();
        },
        error: (err) => {
          console.log("❌ Erreur :", err);
          alert('Error while saving order.');
        }
      });
    }
    
    
// Fonction pour réinitialiser le formulaire
resetOrderForm() {
 // this.selectedCustomerId = '';
 // this.selectedCustomer = null;
 this.orderEvent.product.productIdEvent = null;
  this.selectedProductId = '';
  this.selectedProduct = null;
  this.orderEvent.productItem.productQty = 0;
  this.amount = 0;
  this.tax = 0;
  this.discount = 0;
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

            recalculateTotalCartAmount() {
              console.log("🔄 Recalcul du total...");
              this.totalCartAmount = 0;
            
              this.orders.forEach((order: { basePrice: any; qty: any; }) => {
                const basePrice = Number(order.basePrice);
                const qty = Number(order.qty);
            
                if (isNaN(basePrice) || isNaN(qty)) {
                  console.warn("❗ Données manquantes pour le calcul :", order);
                  return; // ignore cet ordre si données incorrectes
                }
            
                const total = basePrice * qty;
                const tax = total * 0.2;
            
                let discount = 0;
                if (total >= 200) {
                  discount = 0.01 * total;
                } else if (total >= 100) {
                  discount = 0.005 * total;
                }
            
                const finalAmount = total + tax - discount;
                this.totalCartAmount += finalAmount;
              });
            
              console.log("✅ Total recalculé avec taxes/remises :", this.totalCartAmount);
            }
            

            recalculateTotal() {
              console.log("🔄 Recalcul du total...");
              this.totalCartAmount = 0;
            
              this.orders.forEach((order: { price: number; }) => {
                console.log("➕ Ajout du montant (TTC - Remise) :", order.price);
                this.totalCartAmount += order.price;
              });
            
              console.log("✅ Total recalculé :", this.totalCartAmount);
            }
            
            
            

            removeOrder(index: number) {
              const orderToDelete = this.orders[index];
            
              if (!orderToDelete || !orderToDelete.orderIdEvent) {
                console.warn("❗ Order introuvable ou ID manquant");
                return;
              }
            
              const orderIdEvent = orderToDelete.orderIdEvent;
              console.log("🔍 Tentative d'annulation de :", orderToDelete);
            
              this.stockService.cancelOrder(orderIdEvent).subscribe({
                next: (data) => {
                  console.log("✅ Commande annulée :", data);
            
                  const orderIndex = this.orders.findIndex((o: { orderIdEvent: any; }) => o.orderIdEvent === orderIdEvent);
                  if (orderIndex > -1) {
                    console.log("🧹 Suppression de l'ordre à l'index :", orderIndex);
                    this.orders.splice(orderIndex, 1);
            
                    // ✅ Recalcul total propre
                    this.recalculateTotalCartAmount();
            
                    // ✅ Mise à jour visuelle
                    this.cartCount = this.orders.length;
                    this.isCardButtonEnabled = this.cartCount > 0;
                    //this.recalculateTotal(); 
            
                    // Log d’état après suppression
                    console.log("🛒 Panier après suppression :", this.orders);
                    console.log("💰 Nouveau total :", this.totalCartAmount);
                  }
                },
                error: (err) => {
                  console.error("❌ Erreur lors de l'annulation :", err);
                  alert("Erreur lors de l'annulation de la commande.");
                }
              });
            }
            
          
          getOrdersCreatedListByCustomer() {
            this.stockService.getCreatedOrdersByCustomer(this.orderEvent.customer.customerIdEvent, this.status).subscribe({
              next: data => {
                console.log("🔍 Commandes récupérées :", data);
            
                this.orders = data.map((orderItem: any) => ({
                  orderIdEvent: orderItem.orderIdEvent,
                  customer: orderItem.order.customer.name, // Tu peux récupérer le nom s’il est là
                  product: orderItem.product.name,
                  qty: orderItem.quantity,
                  price: orderItem.price,
                  basePrice: orderItem.product.price, // ✅ pour le recalcul taxes/remises
                }));
              },
              error: err => {
                console.log(err);
              }
            });
            
          }
          
            
}
