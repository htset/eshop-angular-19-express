import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../../../../shared/user';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(public storeService: StoreService, private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http
      .post<User>(`${environment.apiUrl}/auth/login`, { username, password })
      .pipe(
        map((user) => {
          sessionStorage.setItem('user', JSON.stringify(user));
          this.storeService.user = user;
          return user;
        })
      );
  }

  logout() {
    this.storeService.cart.emptyCart();
    sessionStorage.removeItem('user');
    this.storeService.user = null;
  }
}
