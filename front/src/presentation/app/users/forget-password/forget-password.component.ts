import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { userDIProvider } from '@users/_config/UserDIProvider';
import { UserRegisterUseCase } from '@users/usecases/register.usecase';
import { Router, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { UserRepository } from '@users/repositories/user.repository';
import { UserImplementationRepository } from '@users/repositories/user-implementation.repository';
import { UserForgetPasswordUseCase } from '@users/usecases/forget-password.usecase';
import { UserStubRepository } from '@users/repositories/user-stub.repository';
import { environment } from '@environment/environment';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterLink,
    NgToastModule
  ],
  providers: [
    userDIProvider.userForgetPassword,
    {provide: UserRepository, useClass: UserImplementationRepository}
  ],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
  appName = environment.appName;
  forgetForm: FormGroup;
  isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(userDIProvider.userForgetPassword.provide)
    private forgetPasswordUseCase: UserForgetPasswordUseCase,
    private router: Router,
    private toastService: NgToastService
  ) {
    this.forgetForm  =  this.formBuilder.group({
      username: ['', Validators.required],
    });
  }

  forgetPassword() {
    if(this.forgetForm.invalid) {
      return;
    }
    this.isSubmitted = true;

    this.forgetPasswordUseCase.execute(this.forgetForm.value).subscribe( {
      next: (register) => {
        this.router.navigate(['/user/forgetpassword/success']);
      },
      error: (error) => {
        this.isSubmitted = false;
        this.toastService.error({detail: 'Erreur', summary: error.message ?? 'Une erreur est survenue, veuillez contacter le support', duration: 5000});
      }
    });
  }
}
