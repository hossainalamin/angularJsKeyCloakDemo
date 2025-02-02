import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { AuthService } from './app/services/auth.service';

// Create instance of AuthService
const keycloakService = new AuthService();

// Initialize Keycloak and only bootstrap the app once authentication is successful
keycloakService.init().then((authenticated) => {
  if (authenticated) {
    // Only bootstrap the app once Keycloak authentication is successful
    bootstrapApplication(AppComponent, appConfig)
      .catch((err) => console.error('Error bootstrapping app:', err));
  } else {
    console.error('Keycloak authentication failed.');
  }
}).catch((err) => {
  console.error('Error initializing Keycloak:', err);
});
