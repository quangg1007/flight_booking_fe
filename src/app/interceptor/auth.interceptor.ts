import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken = this.tokenService.getAccessToken();

    if (accessToken) {
      const authReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return next.handle(authReq);
    }

    return next.handle(request);
  }
}
