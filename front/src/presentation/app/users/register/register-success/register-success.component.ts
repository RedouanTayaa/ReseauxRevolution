import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '@environment/environment';

@Component({
  standalone: true,
  selector: 'app-register-success',
  templateUrl: './register-success.component.html',
  styleUrls: ['./register-success.component.scss'],
  imports: [
    RouterLink
  ]
})
export class RegisterSuccessComponent {
  appName = environment.appName;
}
