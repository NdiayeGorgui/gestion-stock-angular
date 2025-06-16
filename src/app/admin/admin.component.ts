import { Component, OnInit } from '@angular/core';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDrawer } from '@angular/material/sidenav';
import { KeycloakService } from 'keycloak-angular';
import { MatMenu } from '@angular/material/menu';
import { ViewChild } from '@angular/core';
import { StockService } from '../services/stock.service';
import { Notification } from './Notification';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../services/NotificationService';
import { MatDialog } from '@angular/material/dialog';
import { NotificationDialogComponent } from '../shared/notification-dialog/notification-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { SnakBarComponent } from '../shared/snak-bar/snak-bar.component';


@Component({
  selector: 'app-admin',
  standalone: false,

  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  @ViewChild('notificationsMenu') notificationsMenu!: MatMenu;

  drawerMode: 'side' | 'over' = 'side';
  drawerOpened = true;
  isSmallScreen = false;

  firstName: string = '';
  isAdmin = false;

  notifications: Notification[] = [];



  constructor(private keycloakService: KeycloakService,
     private snackBar: MatSnackBar,

    private breakpointObserver: BreakpointObserver, 
    private stockService: StockService, private notifService: NotificationService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(result => {
        if (result.matches) {
          this.drawerMode = 'over';
          this.drawerOpened = false;
          this.isSmallScreen = true;
        } else {
          this.drawerMode = 'side';
          this.drawerOpened = true;
          this.isSmallScreen = false;
        }
      });
  }


  toggleDrawer(drawer: any) {
    drawer.toggle();
  }
  async ngOnInit(): Promise<void> {

    const profile = await this.keycloakService.loadUserProfile();
    this.firstName = profile.firstName || '';
    // Récupère les rôles du realm (par défaut, true = realm roles)
    const roles = this.keycloakService.getUserRoles(true);

    this.isAdmin = roles.includes('ADMIN');

    this.notifService.notifications$.subscribe(notifs => {
      this.notifications = notifs;
    });

    this.notifService.getNotifications(); // ✅ au démarrage


  }

  logout(): void {
    this.keycloakService.logout(window.location.origin); // Redirige vers la page d'accueil
  }

  get username(): string {
    return this.keycloakService.getKeycloakInstance().tokenParsed?.['preferred_username'] || '';
  }

  closeDrawerIfMobile(drawer: MatDrawer): void {
    if (this.isSmallScreen) {
      drawer.close();
    }
  }

  /*notifications = [
    { id: 1, message: 'NOTIF.NEW_ORDER', read: false },
    { id: 2, message: 'NOTIF.OUT_OF_STOCK', read: false }
  ];*/
  getUnreadCount(): number {
    return this.notifService.getUnreadCount();
  }



markAsRead(notif: Notification): void {
  this.stockService.markNotificationAsRead(notif.id).subscribe({
    next: () => {
      notif.readValue = true; // ✅ mise à jour locale

      this.snackBar.openFromComponent(SnakBarComponent, {
        data: {
          message: this.translate.instant('NOTIF.marked_as_read'),
          type: 'success'
        },
        duration: 3000,
        verticalPosition: 'top'
      });
    },
    error: err => {
      console.error('Erreur lors du marquage comme lu', err);

      this.snackBar.openFromComponent(SnakBarComponent, {
        data: {
          message: this.translate.instant('NOTIF.mark_as_read_error'),
          type: 'error'
        },
        duration: 3000,
        verticalPosition: 'top'
      });
    }
  });
}


  /*markAsRead(notif: Notification): void {
     notif.read = true;
   }*/

  public getNotifications() {
    this.stockService.getNotificationsList().subscribe({
      next: data => {
        this.notifications = data.map((n: any) => ({
          id: n.id,
          message: n.message,
          readValue: n.readValue,
          archived: n.archived,
          type: n.type
        } as Notification));
      },
      error: err => {
        console.log(err);
      }
    });

  }

  openNotifications(): void {
  this.dialog.open(NotificationDialogComponent, {
    width: '500px', // ou plus large selon ton design
    data: {}        // tu peux passer des données ici si nécessaire
  });
}


}
