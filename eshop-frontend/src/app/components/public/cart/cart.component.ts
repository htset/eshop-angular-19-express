import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../../../../../shared/cartItem';
import { StoreService } from '../../../services/store.service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  constructor(public storeService: StoreService) {}

  removeFromCart(item: CartItem) {
    this.storeService.cart.removeItem(item);
  }

  emptyCart() {
    this.storeService.cart.emptyCart();
  }

  ngOnInit(): void {}
}
