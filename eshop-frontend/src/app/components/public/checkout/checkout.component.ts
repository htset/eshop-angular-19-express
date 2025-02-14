import { Component, OnInit, signal } from '@angular/core';
import { Address } from '../../../../../../shared/address';
import { StoreService } from '../../../services/store.service';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { mergeMap, tap } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  addressIdForModification = signal<number>(-1);
  selectedAddressId = signal<number>(-1);
  addressList = signal<Address[]>([]);

  constructor(
    public storeService: StoreService,
    public userService: UserService,
    public router: Router
  ) {}

  ngOnInit(): void {
    if (this?.storeService?.user?.id || 0 > 0) {
      //get addresses already saved by user
      this.userService
        .getAddressByUserId(this?.storeService?.user?.id || 0)
        .subscribe((addresses) => {
          this.addressList.set(addresses);
          this.selectedAddressId.set(this.storeService.deliveryAddress);
        });
    }
  }

  selectionChanged(elementId: string): void {
    //elementId contains the ID of the selected address
    this.selectedAddressId.set(
      parseInt(elementId.substring(15, elementId.length))
    );
  }

  //function that is passed to the DeliveryAddress component
  addressChanged(addr: Address | undefined): void {
    let newAddress: Address;
    if (addr !== undefined) {
      addr.userId = this?.storeService?.user?.id || 0;

      if (this?.storeService?.user?.id || 0 > 0) {
        //save address in DB
        this.userService
          .saveAddress(addr)
          .pipe(
            tap((res) => (newAddress = res)),
            mergeMap((res) =>
              this.userService.getAddressByUserId(
                this?.storeService?.user?.id || 0
              )
            )
          )
          .subscribe((addresses) => {
            this.addressList.set(addresses);
            //change selected checkbox
            this.selectedAddressId.set(newAddress.id || 0);
            //toggle modifying
            this.addressIdForModification.set(-1);
          });
      }
    }
  }

  modifyAddress(addr: Address): void {
    this.addressIdForModification.set(addr.id || -1);
  }

  cancelModifyAddress(): void {
    this.addressIdForModification.set(-1);
  }

  deleteAddress(address: Address): void {
    if (this?.storeService?.user?.id || 0 > 0) {
      this.userService.deleteAddress(address.id).subscribe(() => {
        this.addressList.set(
          this.addressList()?.filter((addr) => addr.id != address.id)
        );

        if (this.selectedAddressId() == address.id)
          this.selectedAddressId.set(-1);
      });
    }
  }

  onSubmit(): void {
    this.storeService.deliveryAddress = this.selectedAddressId();
    this.router.navigate(['/payment']);
  }
}
