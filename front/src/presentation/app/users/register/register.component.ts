import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserRegisterUseCase } from '@users/usecases/register.usecase';
import { HttpClientModule } from '@angular/common/http';
import { userDIProvider } from '@users/_config/UserDIProvider';
import { UserRepository } from '@users/repositories/user.repository';
import { UserImplementationRepository } from '@users/repositories/user-implementation.repository';
import { CommonModule } from '@angular/common';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { environment } from '@environment/environment';
import { RegisterModel } from '@users/models/register.model';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterLink,
    CommonModule,
    NgToastModule
  ],
  providers: [
    userDIProvider.userRegister,
    {provide: UserRepository, useClass: UserImplementationRepository}
  ]
})
export class RegisterComponent {
  appName = environment.appName;
  registerForm: FormGroup;
  isSubmitted = false;
  errorConfirmPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(userDIProvider.userRegister.provide)
    private registerUseCase: UserRegisterUseCase,
    private router: Router,
    private toastService: NgToastService
  ) {
    this.registerForm  =  this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  get formControls() {
    return this.registerForm?.controls;
  }

  register() {
    if(this.registerForm.invalid) {
      return;
    }
    if (this.registerForm.controls['password'].value !== this.registerForm.controls['confirmPassword'].value) {
      this.errorConfirmPassword = true;
      return;
    }
    this.isSubmitted = true;

    this.registerUseCase.execute(this.registerForm.value).subscribe( {
      next: (register) => {
        if (register) {
          this.router.navigate(['/user/register/success']);
        }
      },
      error: (error) => {
        this.isSubmitted = false;
        this.toastService.error({detail: 'Erreur', summary: error.message ?? 'Une erreur est survenue, veuillez contacter le support', duration: 5000});
      }
    });
  }
}
