import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,  // ✅ Standalone component
  imports: [CommonModule, RouterModule], // ✅ Import necessary modules
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isAuthenticated = false;

  constructor(private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    try {
      // Only call the initialization once
      if (!this.isAuthenticated) {
        const authenticated = await this.authService.init(); // Initialize Keycloak
        this.isAuthenticated = authenticated;
      }
    } catch (error) {
      console.error('Keycloak initialization failed:', error);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
