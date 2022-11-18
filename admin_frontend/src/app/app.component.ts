import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faSignOut, faTaxi } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'AdminPanel';
  logoutIcon = faSignOut;
  faTaxi = faTaxi;
  _router: Router;

  constructor(private router: Router) {
    this._router = router;
  }

  ngOnInit(): void {
    if (!localStorage.getItem('token')) this._router.navigateByUrl('/login');
  }

  handleSubmit(): void {
    localStorage.clear();
    this._router.navigateByUrl('/login');
  }
}
