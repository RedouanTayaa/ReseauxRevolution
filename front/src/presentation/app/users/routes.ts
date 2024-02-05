import { Route } from '@angular/router';
import { LoginComponent } from '@presentationUsers/login/login.component';
import { RegisterComponent } from '@presentationUsers/register/register.component';
import { RegisterSuccessComponent } from '@presentationUsers/register/register-success/register-success.component';
import { ForgetPasswordComponent } from '@presentationUsers/forget-password/forget-password.component';
import {
  ForgetPasswordSuccessComponent
} from '@presentationUsers/forget-password/forget-password-success/forget-password-success.component';

export default [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'register/success', component: RegisterSuccessComponent},
  {path: 'forgetpassword', component: ForgetPasswordComponent},
  {path: 'forgetpassword/success', component: ForgetPasswordSuccessComponent},
  {path: '**', redirectTo: 'login'},
] as Route[];
