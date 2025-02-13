import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// Correct PrimeNG 18 imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { User } from './user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading: boolean = true;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error fetching users:', error);
        this.loading = false;
      }
    });
  }

  approveUser(user: User): void {
    this.userService.approveUser(user.email).subscribe({
      next: (response: boolean) => {
        user.isApproved = response;
      },
      error: (error: any) => {
        console.error('Error approving user:', error);
      }
    });
  }

  deleteUser(user: User): void {
    // this.userService.deleteUser(user.id).subscribe({
    //   next: (updatedUser: User) => {
    //     user.isActive = updatedUser.isActive;
    //   },
    //   error: (error: any) => {
    //     console.error('Error deleting user:', error);
    //   }
    // });
  }
}
