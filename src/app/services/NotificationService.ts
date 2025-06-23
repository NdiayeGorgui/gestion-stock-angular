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

  private pollingIntervalId: any;

  constructor(private stockService: StockService) {}

  /**
   * Récupère les notifications depuis le serveur
   */
  public getNotifications(): void {
    this.stockService.getNotificationsList().subscribe({
      next: data => {
        const notifList = data.map((n: any) => ({
          id: n.id,
          message: n.message,
          username: n.username,
          readValue: n.readValue,
          archived: n.archived,
          type: n.type,
          productKey: n.productKey,
        }));
        this.notificationsSubject.next(notifList); // ✅ push vers tous les abonnés
      },
      error: err => {
        console.error('Erreur chargement des notifications', err);
      }
    });
  }

  /**
   * Démarre le polling automatique (par défaut toutes les 10 secondes)
   */
  public startPolling(intervalMs: number = 10000): void {
    if (this.pollingIntervalId) {
      clearInterval(this.pollingIntervalId); // évite les doublons
    }

    // ✅ Lancement de la boucle
    this.pollingIntervalId = setInterval(() => {
      this.getNotifications();
    }, intervalMs);
  }

  /**
   * Arrête le polling (utile si tu veux le couper à la déconnexion)
   */
  public stopPolling(): void {
    if (this.pollingIntervalId) {
      clearInterval(this.pollingIntervalId);
      this.pollingIntervalId = null;
    }
  }

  /**
   * Retourne le nombre de notifications non lues
   */
  public getUnreadCount(): number {
    return this.notificationsSubject.getValue().filter(n => !n.readValue).length;
  }
}
