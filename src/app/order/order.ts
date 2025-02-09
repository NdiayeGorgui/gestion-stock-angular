export class Order{
    id!: number;
    orderIdEvent!:string;
    orderStatus!:string;
    customerIdEvent!:string;
    customerName!: string;
    customerAddress!:string;
    customerPhone!: string; 
    customerEmail!:string;
    customerStatus!: string; 
    amount!:string;
    productIdEvent!:string;
    productName!: string;
    qty!:number;
    price!: Number; 
    productStatus!:string;
    qtyStatus!: string;

    productItemQty!: number; 
}
