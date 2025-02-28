import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StockService } from './stock.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  public ordersSource = new BehaviorSubject<any[]>([]);
  orders$ = this.ordersSource.asObservable();
  orders:any;
  status='CREATED';

  constructor(private http: HttpClient, private stockService:StockService) {}


  fetchOrders(){
    this.stockService.getCreatedOrders(this.status).subscribe({
        next: (orders) => this.ordersSource.next(orders),
        error: (err) => console.error('Erreur lors de la récupération des commandes', err)
      });
    }

    // 🟢 Ajouter une nouvelle commande et mettre à jour la liste
  addOrder(newOrder: any) {
    const currentOrders = this.ordersSource.getValue(); // ✅ Récupérer la liste actuelle
    this.ordersSource.next([...currentOrders, newOrder]); // ✅ Ajouter la nouvelle commande
  }
}
