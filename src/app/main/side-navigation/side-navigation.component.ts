// sidebar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarModule,
    ButtonModule,
    MenuModule
  ],
  templateUrl: './side-navigation.component.html',
  styleUrl: './side-navigation.component.scss'
})
export class SidebarComponent {
  sidebarVisible: boolean = false;
  
  menuItems: MenuItem[] = [
    {
      label: 'Overview',
      icon: 'pi pi-home',
      routerLink: '/overview'
    },
    {
      label: 'Users',
      icon: 'pi pi-users',
      routerLink: '/users'
    }
  ];
}
