import { Component, OnInit } from '@angular/core';
import { User } from '../../../../../../shared/user';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-admin-users',
  standalone: false,
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css',
})
export class AdminUsersComponent implements OnInit {
  users!: User[];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getAllUsers().subscribe(
      (users: User[]) => {
        this.users = users;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
}
