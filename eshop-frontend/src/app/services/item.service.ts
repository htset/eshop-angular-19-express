import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { Item } from '../../../../shared/item';
import { ItemPayload } from '../../../../shared/itemPayload';
import { Filter } from '../../../../shared/filter';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  itemsUrl = `${environment.apiUrl}/items`;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getItems(
    page: number,
    pageSize: number,
    filter: Filter
  ): Observable<ItemPayload> {
    let categoriesString: string = '';
    filter.categories.forEach(
      (cc) => (categoriesString = categoriesString + cc + ',')
    );
    if (categoriesString.length > 0)
      categoriesString = categoriesString.substring(
        0,
        categoriesString.length - 1
      );

    let params = new HttpParams()
      .set('name', filter.name)
      .set('pageNumber', page.toString())
      .set('pageSize', pageSize.toString())
      .set('category', categoriesString);

    return this.http.get<ItemPayload>(this.itemsUrl, { params: params });
  }

  getItem(id: number): Observable<Item> {
    const url = `${this.itemsUrl}/${id}`;
    return this.http.get<Item>(url);
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  constructor(private http: HttpClient) {}
}
