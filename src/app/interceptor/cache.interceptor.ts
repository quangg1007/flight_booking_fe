import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, shareReplay, tap } from 'rxjs';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cache = new Map<string, HttpResponse<any>>();
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.method !== 'GET') {
      return next.handle(request);
    }

    const cachedResponse = this.cache.get(request.urlWithParams);
    if (cachedResponse) {
      console.log('Serving from cache:', request.urlWithParams);
      console.log(cachedResponse.clone());
      return of(cachedResponse.clone());
    }

    return next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          console.log('Caching response for:', request.urlWithParams);
          this.cache.set(request.urlWithParams, event.clone());
        }
      }),
      shareReplay(1)
    );
  }
}
