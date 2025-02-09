import { Customer } from "../customer";
import { Product } from "../product";
import { ProductItem } from "../productItem";

    
export class OrderEvent{
    orderIdEvent!:string;
    customer!:Customer;
    product!:Product;
    productItem!:ProductItem;

     constructor(){
    
      }
}
   
