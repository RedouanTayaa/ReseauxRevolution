import { Route } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';

export const routes: Route[] = [
  {
    path: 'user',
    loadChildren: () => import('./users/routes'),
  },
  {
    path: 'post',
    loadChildren: () => import('./posts/routes'),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: 'post',
  },
];
