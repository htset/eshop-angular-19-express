import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Item } from '../../../../shared/item';
import { Filter } from '../../../../shared/filter';
import { Cart } from '../../../../shared/cart';
import { User } from '../../../../shared/user';
import { Order } from '../../../../shared/order';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private readonly _items = new BehaviorSubject<Item[]>([]);
  readonly items$ = this._items.asObservable();

  get items(): Item[] {
    return this._items.getValue();
  }

  set items(val: Item[]) {
    this._items.next(val);
  }

  private readonly _page = new BehaviorSubject<number>(1);
  readonly page$ = this._page.asObservable();

  get page(): number {
    return this._page.getValue();
  }

  set page(val: number) {
    this._page.next(val);
  }

  public pageSize: number = 3;
  public readonly _pageSizeSubject = new Subject<number>();
  public pageSizeChanges$ = this._pageSizeSubject.asObservable();

  private readonly _count = new BehaviorSubject<number>(1);
  readonly count$ = this._count.asObservable();

  get count(): number {
    return this._count.getValue();
  }

  set count(val: number) {
    this._count.next(val);
  }

  private readonly _filter = new BehaviorSubject<Filter>({
    name: '',
    categories: [],
  });
  readonly filter$ = this._filter.asObservable();

  get filter(): Filter {
    return this._filter.getValue();
  }

  set filter(val: Filter) {
    this._filter.next(val);
  }

  private readonly _cart = new BehaviorSubject<Cart>(new Cart());
  readonly cart$ = this._cart.asObservable();

  get cart(): Cart {
    return this._cart.getValue();
  }

  set cart(val: Cart) {
    this._cart.next(val);
  }

  private readonly _user = new BehaviorSubject<User | null>(
    sessionStorage.getItem('user') === null
      ? null
      : JSON.parse(sessionStorage.getItem('user') ?? '')
  );
  readonly user$ = this._user.asObservable();

  get user(): User | null {
    return this._user.getValue();
  }

  set user(val: User | null) {
    this._user.next(val);
  }

  private readonly _deliveryAddress = new BehaviorSubject<number>(-1);
  readonly deliveryAddress$ = this._deliveryAddress.asObservable();

  get deliveryAddress(): number {
    return this._deliveryAddress.getValue();
  }

  set deliveryAddress(val: number) {
    this._deliveryAddress.next(val);
  }

  private readonly _order = new BehaviorSubject<Order>(new Order());
  readonly order$ = this._order.asObservable();

  get order(): Order {
    return this._order.getValue();
  }

  set order(val: Order) {
    this._order.next(val);
  }

  constructor() {}
}
