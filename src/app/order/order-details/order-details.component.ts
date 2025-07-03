import { Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderEvent } from '../orders/orderEvent';
import { ProductItem } from '../productItem';
import { MatTableDataSource } from '@angular/material/table';
import { Custom } from '../custom';
import { AmountDto } from '../../payment/create-payment/amountDto';
import { OrderResponseDto } from '../../payment/OrderResponseDto';
import { ProductItemResponseDto } from '../../payment/ProductItemResponseDto';

@Component({
  selector: 'app-order-details',
  standalone: false,

  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent implements OnInit {

  orderId!: string;
  order: OrderResponseDto = {
    orderId: '',
    customerName: '',
    customerEmail: '',
    amount: 0,
    totalTax: 0,
    totalDiscount: 0,
    createdDate:'',
    items: []  // ✅ Nécessaire pour éviter erreur sur table
  };
   public status = 'CREATED';

  dataSource = new MatTableDataSource<ProductItemResponseDto>([]);
  displayedColumns: string[] = ['productId', 'productName', 'quantity', 'price', 'discount', 'tax'];

  constructor(
    private stockService: StockService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
  this.orderId = this.route.snapshot.params['orderId'];

  // ✅ Vérification : si orderId est manquant ou vide, on évite l'appel API
  if (!this.orderId) {
    console.error('❌ Paramètre "orderId" manquant dans l\'URL');
    this.router.navigate(['/admin/order']); // ou rediriger vers une page d'erreur
    return;
  }

  this.stockService.getOneOrderById(this.orderId).subscribe({
    next: (data) => {
      this.order = data;
      this.dataSource.data = data.items;
      console.log('✅ Données chargées :', data);
    },
    error: (err) => {
      console.error('❌ Erreur API :', err);
    }
  });
}

  close(): void {
    this.router.navigate(['/admin/order']);
  }
}