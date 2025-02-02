import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { AuthService } from './app/services/auth.service';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
const keycloakService = new AuthService();

keycloakService.init().then((authenticated) => {
  platformBrowserDynamic().bootstrapModule(AppComponent)
    .catch(err => console.error(err));
});
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
