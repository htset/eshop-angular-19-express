import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../../services/item.service';
import { StoreService } from '../../../services/store.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { skip } from 'rxjs';
import { FilterComponent } from '../../shared/filter/filter.component';

@Component({
  selector: 'app-items',
  standalone: false,
  templateUrl: './items.component.html',
  styleUrl: './items.component.css',
})
export class ItemsComponent implements OnInit {
  constructor(
    private itemService: ItemService,
    public storeService: StoreService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.storeService.pageSizeChanges$.subscribe((newPageSize) => {
      this.storeService.page = 1;
      this.getItems();
    });

    this.storeService.filter$
      .pipe(skip(1)) //skip getting filter at component creation
      .subscribe((filter) => {
        this.storeService.page = 1;
        this.getItems();
      });

    this.getItems();
  }

  getItems(): void {
    this.itemService
      .getItems(
        this.storeService.page,
        this.storeService.pageSize,
        this.storeService.filter
      )
      .subscribe((itemPayload) => {
        this.storeService.items = itemPayload.items;
        this.storeService.count = itemPayload.count;
      });
  }

  onPageChange(newPage: number): void {
    this.storeService.page = newPage;
    this.getItems();
  }

  onPageSizeChange(): void {
    this.storeService._pageSizeSubject.next(this.storeService.pageSize);
  }

  openFilter(): void {
    this.modalService.open(FilterComponent);
  }
}
