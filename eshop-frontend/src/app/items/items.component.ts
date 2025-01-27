import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service';
import { Item } from '../../../../shared/item';

@Component({
  selector: 'app-items',
  standalone: false,
  templateUrl: './items.component.html',
  styleUrl: './items.component.css',
})
export class ItemsComponent implements OnInit {
  items: Item[] = [];

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.getItems();
  }

  getItems(): void {
    this.itemService.getItems().subscribe((items) => {
      this.items = items;
    });
  }
}
