import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '../admin/Notification';
import { StockService } from './stock.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor(private stockService: StockService) {}

  public getNotifications(): void {
    this.stockService.getNotificationsList().subscribe({
      next: data => {
        const notifList = data.map((n: any) => ({
          id: n.id,
          message: n.message,
          readValue: n.readValue,
          archived: n.archived
        }));
        this.notificationsSubject.next(notifList);
      },
      error: err => {
        console.error('Erreur chargement des notifications', err);
      }
    });
  }

  public getUnreadCount(): number {
    return this.notificationsSubject.getValue().filter(n => !n.readValue).length;
  }
}
