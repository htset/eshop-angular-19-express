import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { StoreService } from '../services/store.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private storeService: StoreService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.storeService.user;
    if (currentUser && currentUser.role == 'ADMIN') {
      //User is admin
      return true;
    } else if (currentUser && currentUser.role == 'CUSTOMER') {
      if (route.url.some((segment) => segment.path.includes('admin'))) {
        //User is customer -> redirect to /items
        this.router.navigate(['/items']);
      }
      return true;
    }

    //User not logged in -> redirect to /login
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
