import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Cart } from '../../../../../../shared/cart';
import { Order } from '../../../../../../shared/order';
import { OrderDetail } from '../../../../../../shared/orderDetail';
import { OrderService } from '../../../services/order.service';
import { StoreService } from '../../../services/store.service';

@Component({
  selector: 'app-payment',
  standalone: false,
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  currentYear: number = new Date().getFullYear();

  paymentForm = new FormGroup(
    {
      cardNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]{16}$/),
      ]),
      holderName: new FormControl('', Validators.required),
      code: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]{3}$/),
      ]),
      expiryMonth: new FormControl('', Validators.required),
      expiryYear: new FormControl('', Validators.required),
    },
    [ValidateExpirationDate]
  );

  constructor(
    public storeService: StoreService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    let userId = this?.storeService?.user?.id || 0;
    if (userId > 0) {
      //if user is logged in
      let order: Order = new Order();
      order.userId = userId;

      //get cart items and create OrderDetails objects out of them
      order.orderDetails = this.storeService.cart.cartItems.map((cartItem) => {
        let orderDetail: OrderDetail = new OrderDetail();
        orderDetail.itemId = cartItem.item.id;
        orderDetail.quantity = cartItem.quantity;
        return orderDetail;
      });

      //get delivery address ID
      order.deliveryAddressId = this.storeService.deliveryAddress;

      //get credit card details
      order.creditCard = {
        cardNumber: this.paymentForm.controls.cardNumber.value || '',
        holderName: this.paymentForm.controls.holderName.value || '',
        code: this.paymentForm.controls.code.value || '',
        expiryMonth: parseInt(
          this.paymentForm.controls.expiryMonth.value || '0'
        ),
        expiryYear: parseInt(this.paymentForm.controls.expiryYear.value || '0'),
      };

      //Submit order
      this.orderService.addOrder(order).subscribe((orderResult: Order) => {
        this.storeService.order = orderResult;
        this.storeService.cart = new Cart();
        this.storeService.deliveryAddress = -1;

        this.router.navigate(['/summary']);
      });
    }
  }

  //creates a sequence of months
  numSequence(n: number): Array<number> {
    return Array(n);
  }

  //creates a sequence of years
  numSequenceStart(n: number, startFrom: number): number[] {
    return [...Array(n).keys()].map((i) => i + startFrom);
  }
}

//Custom validator for the expiration date
function ValidateExpirationDate(
  control: AbstractControl
): { [key: string]: any } | null {
  if (control?.get('expiryMonth')?.value && control?.get('expiryYear')?.value) {
    //get expiry month and year values from the respective controls
    let month: number = parseInt(control?.get('expiryMonth')?.value);
    let year: number = parseInt(control?.get('expiryYear')?.value);
    let currentDate = new Date();

    //compare with current date
    if (year < currentDate.getFullYear()) return { CreditCardExpired: true };
    else if (
      year == currentDate.getFullYear() &&
      month - 1 < currentDate.getMonth()
    )
      return { CreditCardExpired: true };
  }
  return null;
}
