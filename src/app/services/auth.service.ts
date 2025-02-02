import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private keycloak: Keycloak.KeycloakInstance = {} as Keycloak.KeycloakInstance; // Initialize with an empty object
  private initialized = false;

  constructor() {
    // Ensure Keycloak is initialized only if running in a browser environment
    if (typeof window !== 'undefined') {
      this.keycloak = new Keycloak({
        url: 'https://erpdevelopment.brac.net/idp', // Keycloak server URL
        realm: 'brac', // Your realm
        clientId: 'iou', // Your client ID
      });
    }
  }

  /**
   * Initialize Keycloak and perform authentication check
   */
  async init(): Promise<boolean> {
    // Check if we're in a browser environment and Keycloak is available
    if (typeof window === 'undefined' || !this.keycloak) {
      return false;
    }

    if (this.initialized) {
      return this.isAuthenticated();
    }

    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'login-required', // Force login if not already authenticated
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
        pkceMethod: 'S256',
        checkLoginIframe: false,
      });

      this.initialized = true;
      console.log(authenticated ? 'Authenticated' : 'Not authenticated');
      return authenticated;
    } catch (error) {
      console.error('Keycloak initialization failed:', error);
      return false;
    }
  }

  /**
   * Refresh the Keycloak token if needed
   */
  async refreshToken(): Promise<void> {
    // Check if we're in a browser environment before attempting token refresh
    if (typeof window === 'undefined' || !this.keycloak) {
      return;
    }

    try {
      const refreshed = await this.keycloak.updateToken(70); // Refresh if token expires in 70 seconds
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
    // Check if we're in a browser environment before calling Keycloak.logout
    if (typeof window !== 'undefined' && this.keycloak) {
      this.keycloak.logout({
        redirectUri: window.location.origin, // Redirect to home page after logout
      });
    }
  }

  /**
   * Check if the user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    // Ensure that the token exists and is valid, check only in the browser
    if (typeof window === 'undefined' || !this.keycloak) {
      return false;
    }
    return !!this.keycloak.token;
  }

  /**
   * Trigger login process (redirect to Keycloak login page)
   */
  login(): void {
    // Ensure login only happens in a browser environment
    if (typeof window !== 'undefined' && this.keycloak && !this.keycloak.token && !this.keycloak.authenticated) {
      this.keycloak.login(); // Redirect to Keycloak login page if no token or not authenticated
    }
  }

  /**
   * Trigger Keycloak logout process
   */
  logoutAndRedirect(): void {
    // Ensure logout only happens in a browser environment
    if (typeof window !== 'undefined' && this.keycloak) {
      this.keycloak.logout({
        redirectUri: window.location.origin, // Ensure redirect after logout
      });
    }
  }

  /**
   * Check if the current session is valid or if the token is about to expire
   */
  async checkSessionValidity(): Promise<boolean> {
    // Only proceed if in a browser environment
    if (typeof window === 'undefined' || !this.keycloak) {
      return false;
    }

    try {
      const valid = await this.keycloak.updateToken(60); // Check if token is valid for at least 60 seconds
      return valid;
    } catch (error) {
      console.error('Session invalid', error);
      return false;
    }
  }
}
