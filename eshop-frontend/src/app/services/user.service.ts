import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../../../shared/user';
import { environment } from '../../environments/environment';
import { Address } from '../../../../shared/address';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  getAllUsers() {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  getAddressByUserId(userId: number) {
    return this.http.get<Address[]>(
      `${environment.apiUrl}/addresses/${userId}`
    );
  }

  saveAddress(address: Address) {
    return this.http.post<Address>(`${environment.apiUrl}/addresses`, address);
  }

  deleteAddress(addressId?: number) {
    return this.http.delete<number>(
      `${environment.apiUrl}/addresses/${addressId}`
    );
  }
}
