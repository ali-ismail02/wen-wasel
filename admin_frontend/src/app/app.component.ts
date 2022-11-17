import { Component } from '@angular/core';
import { faSignOut, faTaxi } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'admin_frontend';
  logoutIcon = faSignOut;
  faTaxi = faTaxi;
}
