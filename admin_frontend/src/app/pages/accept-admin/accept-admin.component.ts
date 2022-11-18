import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-accept-admin',
  templateUrl: './accept-admin.component.html',
  styleUrls: ['./accept-admin.component.css'],
})
export class AcceptAdminComponent implements OnInit {
  state: any;
  driver: any;
  api: string = '';
  loading: boolean = false;
  constructor(private router: Router) {
    if (!router.getCurrentNavigation()?.extras.state) router.navigateByUrl('/');
    else this.state = router.getCurrentNavigation()?.extras.state;
    this.driver = this.state.driver;
  }

  ngOnInit(): void {
    console.log(this.driver);
    this.api = environment.api;
  }

  toDate(date: Date): String {
    return new Date(date).toLocaleDateString();
  }

  async handleAcceptReject(status: number): Promise<void> {
    try {
      let token = localStorage.getItem('token');
      this.loading = true;
      let { data } = await axios.put(
        this.api + '/api/admin/accept-reject-driver',
        {
          user_id: this.driver[1].user_id,
          id: this.driver[1].id,
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      this.loading = false;
      console.log(data);
      window.location.href = '/';
    } catch (e) {
      this.loading = false;
      console.log(e);
    }
  }
}
