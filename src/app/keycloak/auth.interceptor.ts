import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { from, mergeMap, Observable } from "rxjs";
import { AuthenticationService } from "../services/authentication.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 🟡 Ne pas ajouter d'entête Authorization pour les fichiers statiques
    if (req.url.includes('/assets/')) {
      return next.handle(req);
    }

    return from(this.authService.getToken()).pipe(
      mergeMap(token => {
        if (token) {
          const clonedReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          return next.handle(clonedReq);
        }
        return next.handle(req);
      })
    );
  }
}
