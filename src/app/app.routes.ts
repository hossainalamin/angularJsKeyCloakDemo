import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // Import AuthGuard
// import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
// import { LoginComponent } from './components/login/login.component';
// import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'login', redirectTo: 'dashboard', pathMatch: 'full' }, // ✅ Redirect logged-in users
  { path: '**', redirectTo: 'dashboard' } // ✅ Handle unknown routes
];
