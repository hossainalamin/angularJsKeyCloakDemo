import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true, // ✅ Mark as standalone
  imports: [CommonModule], // ✅ Import necessary modules
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isAuthenticated = false;

  constructor(private authService: AuthService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    try {
      const authenticated = await this.authService.isAuthenticated();
      if (!authenticated) {
        this.router.navigate(['/login']); // Redirect to login if not authenticated
      } else {
        this.isAuthenticated = true;
      }
    } catch (error) {
      console.error('Authentication check failed', error);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Ensure to navigate to the login page after logout
  }
}
