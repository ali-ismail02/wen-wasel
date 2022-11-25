import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowRight, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-van-drivers',
  templateUrl: './van-drivers.component.html',
  styleUrls: ['./van-drivers.component.css'],
})
export class VanDriversComponent implements OnInit {
  searchIcon = faSearch;
  checkIcon = faCheck;
  arrowRight = faArrowRight;

  allDrivers: Array<any> = [];
  filteredDrivers: Array<any> = [];
  constructor(private router: Router) {}

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    axios
      .get(environment.api + '/api/admin/get-van-drivers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        this.allDrivers = data.drivers;
        this.allDrivers.forEach((driver) => {
          driver[0].created_at = new Date(
            driver[0].created_at
          ).toLocaleDateString();
        });
        this.filteredDrivers = this.allDrivers;
      });
  }

  filterDrivers(event: Event): void {
    let value = (event.target as HTMLInputElement).value;
    this.filteredDrivers = this.allDrivers.filter(
      (driver) =>
        driver[0].name.includes(value) ||
        driver[0].email.includes(value) ||
        driver[1].make.includes(value) ||
        driver[1].model.includes(value) ||
        driver[1].year.toString().includes(value) ||
        driver[1].license_plate.toString().includes(value)
    );
  }

  handleNavigate(driver: any): void {
    this.router.navigate(['/accept'], { state: { driver } });
  }
}
