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
  image: string = "";
  name: string = "";


  constructor(private router: Router) {
    this._router = router;
  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.image = `http://localhost:8000/images/${user.image}`;
    this.name = user.name;
    if (!localStorage.getItem('token')) this._router.navigateByUrl('/login');
    console.log( this._router);
  }

  handleSubmit(): void {
    localStorage.clear();
    this._router.navigateByUrl('/login');
  }
}
