import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { environment } from '@environment/environment';

@Component({
  selector: 'app-forget-password-success',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './forget-password-success.component.html',
  styleUrl: './forget-password-success.component.scss'
})
export class ForgetPasswordSuccessComponent {
  appName = environment.appName;
}
