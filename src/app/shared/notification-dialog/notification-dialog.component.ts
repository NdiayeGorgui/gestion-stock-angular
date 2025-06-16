import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '../../services/NotificationService';
import { Notification } from '../../admin/Notification';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-notification-dialog',
  standalone: false,
  templateUrl: './notification-dialog.component.html',
  styleUrl: './notification-dialog.component.css'
})
export class NotificationDialogComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifService: NotificationService,private snackBar: MatSnackBar,private stockService: StockService
  ) {}

  ngOnInit(): void {
    this.notifService.notifications$.subscribe(n => this.notifications = n);
    this.notifService.getNotifications();
  }

  markAsRead(notif: Notification): void {
    this.stockService.markNotificationAsRead(notif.id).subscribe({
      next: () => {
        notif.readValue = true; // ✅ mise à jour locale
        this.snackBar.open('Notification marked as read ✔️', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });

      },
      error: err => {
        console.error('Erreur lors du marquage comme lu', err);
        this.snackBar.open('Erreur lors de la mise à jour ❌', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
    });
  }

  markAllAsRead(): void {
  this.notifications.forEach(notif => {
    if (!notif.readValue) {
      this.markAsRead(notif); // Tu peux aussi appeler directement stockService si tu préfères
    }
  });
}

}
