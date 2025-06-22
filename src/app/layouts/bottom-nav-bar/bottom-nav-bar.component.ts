import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-bottom-nav-bar',
  templateUrl: './bottom-nav-bar.component.html',
  styleUrls: ['./bottom-nav-bar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
})
export class BottomNavBarComponent {
  navItems = [
    {
      path: '/home',
      icon: 'home',
      label: 'Home',
    },
    {
      path: '/activity',
      icon: 'timeline',
      label: 'Activity',
    },
    {
      path: '/dashboard',
      icon: 'bar_chart',
      label: 'Dashboard',
    },
    {
      path: '/alerts',
      icon: 'notifications',
      label: 'Alerts',
    },
    {
      path: '/profile',
      icon: 'person',
      label: 'Profile',
    },
  ];
}
