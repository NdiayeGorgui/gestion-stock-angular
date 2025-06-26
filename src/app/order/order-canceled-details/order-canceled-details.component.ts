import { Component } from '@angular/core';
import { OrderResponseDto } from '../../payment/OrderResponseDto';
import { ProductItemResponseDto } from '../../payment/ProductItemResponseDto';
import { MatTableDataSource } from '@angular/material/table';
import { StockService } from '../../services/stock.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-canceled-details',
  standalone: false,
  templateUrl: './order-canceled-details.component.html',
  styleUrl: './order-canceled-details.component.css'
})
export class OrderCanceledDetailsComponent {
 orderId!: string;
  order: OrderResponseDto = {
    orderId: '',
    customerName: '',
    customerEmail: '',
    amount: 0,
    totalTax: 0,
    totalDiscount: 0,
    items: []  // ✅ Nécessaire pour éviter erreur sur table
  };
   public status = 'CANCELED';

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

  this.stockService.getCreatedOrdersById(this.status,this.orderId).subscribe({
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

 close() {
  const status = this.status.toLowerCase();
    this.router.navigate(['/admin/cancel-order']);
  
}


}
