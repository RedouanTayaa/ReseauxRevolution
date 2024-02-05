import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { environment } from '@environment/environment';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    RouterOutlet
  ]
})
export class AppComponent implements OnInit {
  title = environment.appName;

  ngOnInit(): void {
    initFlowbite();
  }
}
