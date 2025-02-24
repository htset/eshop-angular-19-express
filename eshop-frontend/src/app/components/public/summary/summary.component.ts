import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../../services/store.service';
import { User } from '../../../../../../shared/user';

@Component({
  selector: 'app-summary',
  standalone: false,
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent implements OnInit {
  public userInOrder?: User;
  constructor(public storeService: StoreService) {}

  ngOnInit(): void {}
}
