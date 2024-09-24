import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private auth: AuthService,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const expectedRole = route.data['expectedRole'];
    const token = this.tokenService.getAccessToken();

    if (!token) {
      return false;
    }
    // decode the token to get its payload
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));

    if (!this.auth.isAuthenticated() || tokenPayload.isAdmin !== expectedRole) {
      this.router.navigate(['login']);
      return false;
    }

    return true;
  }
}
