import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserLoginUseCase } from '@users/usecases/login.usecase';
import { AuthService } from '@core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { userDIProvider } from '@users/_config/UserDIProvider';
import { UserRepository } from '@users/repositories/user.repository';
import { UserImplementationRepository } from '@users/repositories/user-implementation.repository';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { environment } from '@environment/environment';


@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterLink,
    NgToastModule
  ],
  providers: [
    userDIProvider.userLogin,
    {provide: UserRepository, useClass: UserImplementationRepository}
  ]
})
export class LoginComponent {
  appName = environment.appName;
  authForm: FormGroup;
  isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(userDIProvider.userLogin.provide)
    private loginUseCase: UserLoginUseCase,
    private authService: AuthService,
    private router: Router,
    private toastService: NgToastService
  ) {
    this.authForm  =  this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get formControls() {
    return this.authForm?.controls;
  }

  login() {
    if(this.authForm.invalid) {
      return;
    }
    this.isSubmitted = true;

    this.loginUseCase.execute(this.authForm.value).subscribe({
      next: (user) => {
        this.authService.setToken(user.token);
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isSubmitted = false;
        this.toastService.error({detail: 'Erreur', summary: error.message ?? 'Identifiant ou mot de passe invalide', duration: 5000});
      }
    });
  }
}
