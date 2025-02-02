import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private keycloak: Keycloak.KeycloakInstance;
  private initialized = false;

  constructor() {
    this.keycloak = new Keycloak({
      url: 'https://erpdevelopment.brac.net/idp', // Keycloak server URL
      realm: 'brac', // Your realm
      clientId: 'iou', // Your client ID
    });
  }

  /**
   * Initialize Keycloak and perform authentication check
   */
  async init(): Promise<boolean> {
    if (this.initialized) {
      return this.isAuthenticated();
    }

    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',  // Check if the user is logged in, don't force login
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html', // For silent login checks
        pkceMethod: 'S256', // Enable PKCE (Proof Key for Code Exchange) for security
        checkLoginIframe: false // Disable iframe check to prevent reloading the page too frequently
      });

      this.initialized = true;
      console.log(authenticated ? 'Authenticated' : 'Not authenticated');
      return authenticated;
    } catch (error) {
      console.error('Keycloak initialization failed', error);
      return false;
    }
  }

  /**
   * Refresh the Keycloak token if needed
   */
  private async refreshToken(): Promise<void> {
    try {
      const refreshed = await this.keycloak.updateToken(70); // Refresh if token is expiring in 70 seconds
      console.log(refreshed ? 'Token refreshed' : 'Token still valid');
    } catch (error) {
      console.error('Failed to refresh token', error);
    }
  }

  /**
   * Get the Keycloak token
   */
  getToken(): string | undefined {
    return this.keycloak.token;
  }

  /**
   * Logout the user from Keycloak and redirect to the home page
   */
  logout(): void {
    this.keycloak.logout({
      redirectUri: window.location.origin, // Redirect to home page after logout
    });
  }

  /**
   * Check if the user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    // Ensure that the token exists and is valid
    return !!this.keycloak.token;
  }

  /**
   * Trigger login process (redirect to Keycloak login page)
   */
  login(): void {
    if (!this.keycloak.token) {
      this.keycloak.login(); // Redirect to Keycloak login page if no token exists
    }
  }

  /**
   * Trigger Keycloak logout process
   */
  logoutAndRedirect(): void {
    this.keycloak.logout({
      redirectUri: window.location.origin, // Ensure redirect after logout
    });
  }

  /**
   * Check if the current session is valid or if the token is about to expire
   */
  async checkSessionValidity(): Promise<boolean> {
    try {
      const valid = await this.keycloak.updateToken(60); // Check if token is valid for at least 60 seconds
      return valid;
    } catch (error) {
      console.error('Session invalid', error);
      return false;
    }
  }
}
