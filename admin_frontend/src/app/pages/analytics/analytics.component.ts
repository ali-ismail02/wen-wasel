import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
})
export class AnalyticsComponent implements OnInit {
  constructor() {}

  most_popular_routes: any = {};
  least_popular_routes: any = [];
  most_active_van_drivers: any = [];
  most_active_service_drivers: any = [];

  most_array = [];
  least_array = [];

  LineChart: ChartType = ChartType.LineChart;

  ngOnInit(): void {
    try {
      console.log(localStorage.getItem('token'));
      let token = localStorage.getItem('token');
      axios
        .get(environment.api + '/api/admin/get-analytics', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(({ data }) => {
          this.most_popular_routes = data.most_popular_routes;
          this.least_popular_routes = data.least_popular_routes;
          this.most_active_van_drivers = data.most_active_van_drivers;
          this.most_active_service_drivers = data.most_active_service_drivers;

          let res: any = [];
          Object.entries(this.most_popular_routes).forEach(([key, value]) =>
            console.log(res.push([key, value]))
          );
          this.most_array = res;
          res = [];
          Object.entries(this.least_popular_routes).forEach(([key, value]) =>
            console.log(res.push([key, value]))
          );
          this.least_array = res;
        });
    } catch (error) {
      console.log(error);
    }
  }
}
