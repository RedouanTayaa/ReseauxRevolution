import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { environment } from '@environment/environment';
import { userDIProvider } from '@users/_config/UserDIProvider';
import { UserRepository } from '@users/repositories/user.repository';
import { UserImplementationRepository } from '@users/repositories/user-implementation.repository';
import { UserStripeLinkUseCase } from '@users/usecases/stripe-link.usecase';

@Component({
  selector: 'app-header-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header-navbar.component.html',
  styleUrls: ['./header-navbar.component.scss'],
  providers: [
    userDIProvider.userStripeLink,
    {provide: UserRepository, useClass: UserImplementationRepository}
  ]
})
export class HeaderNavbarComponent implements OnInit {
  appName = environment.appName;
  stripeLink: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(userDIProvider.userStripeLink.provide)
    private stripeLinkUseCase: UserStripeLinkUseCase
    ) {
  }

  ngOnInit() {
    this.stripeLinkUseCase.execute().subscribe({
      next: (stripe) => {
        this.stripeLink = stripe.link;
      }
    });
  }

  logout() {
    this.authService.removeToken();
    this.router.navigate(['/user/login']);
  }
}
