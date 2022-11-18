import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  _loginError: string = '';
  loading: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.router.navigateByUrl('/passengers');
    }
  }

  async handleSubmit(f: NgForm): Promise<void> {
    try {
      let email = f.value.email;
      let password = f.value.password;
      if (f.valid) {
        this._loginError = '';
        this.loading = true;
        let { data } = await axios.post(environment.api + '/api/auth/login', {
          email,
          password,
        });
        this.loading = false;
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        this.router.navigateByUrl('/passengers');
      }
    } catch (error: any) {
      this.loading = false;
      if (error.response?.status == 401) {
        this._loginError = error.response.statusText;
      }
    }
  }
}
