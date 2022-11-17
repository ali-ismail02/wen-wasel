import { Component } from '@angular/core';
import {
  faArrowRight,
  faCheck,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-passengers',
  templateUrl: './passengers.component.html',
  styleUrls: ['./passengers.component.css']
})
export class PassengersComponent {

  searchIcon = faSearch;
  checkIcon = faCheck;
  arrowRight = faArrowRight;

}
