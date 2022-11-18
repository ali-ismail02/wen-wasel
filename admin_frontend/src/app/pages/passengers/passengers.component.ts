import { Component, OnInit } from '@angular/core';
import {
  faArrowRight,
  faCheck,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-passengers',
  templateUrl: './passengers.component.html',
  styleUrls: ['./passengers.component.css'],
})
export class PassengersComponent implements OnInit {
  searchIcon = faSearch;
  checkIcon = faCheck;
  arrowRight = faArrowRight;

  allPassengers: Array<any> = [];
  filteredPassengers: Array<any> = [];

  constructor() {}

  ngOnInit(): void {
    localStorage.setItem('token',"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE2Njg3ODcyNTgsImV4cCI6MTY2OTM5MjA1OCwibmJmIjoxNjY4Nzg3MjU4LCJqdGkiOiJkWEswdnBYTDllYVhJdEdSIiwic3ViIjoiOCIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.2ZRBNlEYUqYd9sxWHXvV2G7qMDEsX9PLvwdCfkhDRbA");
    let token = localStorage.getItem('token');
    axios
      .get(environment.api + '/api/admin/get-passengers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        this.allPassengers = data.users;
        this.allPassengers.forEach((user) => {
          user.created_at = new Date(user.created_at).toLocaleDateString();
        });
        this.filteredPassengers = this.allPassengers;
      });
  }

  filterDrivers(event: Event): void {
    let value = (event.target as HTMLInputElement).value;
    this.filteredPassengers = this.allPassengers.filter(
      (user) => user.name.includes(value) || user.email.includes(value)
    );
  }
}
