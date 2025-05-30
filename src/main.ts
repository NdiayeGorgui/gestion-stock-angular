import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { KeycloakService } from './app/keycloak/keycloak.service';


const keycloakService = new KeycloakService();

keycloakService.init().then(() => {
  platformBrowserDynamic([{ provide: KeycloakService, useValue: keycloakService }])
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
});

platformBrowserDynamic().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));
