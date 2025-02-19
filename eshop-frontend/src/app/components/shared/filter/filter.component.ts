import { Component, OnInit } from '@angular/core';
import { Filter } from '../../../../../../shared/filter';
import { StoreService } from '../../../services/store.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-filter',
  standalone: false,
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent implements OnInit {
  categories = [
    { name: 'Shoes', selected: false },
    { name: 'Clothes', selected: false },
    { name: 'Gear', selected: false },
  ];

  tempFilter: Filter = { name: '', categories: [] };

  constructor(
    public storeService: StoreService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.tempFilter = this.storeService.filter;
    this.categories = this.categories.map((cat) => ({
      name: cat.name,
      selected: this.tempFilter.categories.includes(cat.name),
    }));
  }

  onChange(): void {
    this.tempFilter.categories = this.categories
      .filter((c) => c.selected)
      .map((cc) => cc.name);
  }

  onFilterChanged(): void {
    this.storeService.filter = this.tempFilter;
  }
}
