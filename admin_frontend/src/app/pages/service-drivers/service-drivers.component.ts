import { Component } from '@angular/core';
import {
  faArrowRight,
  faCheck,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-service-drivers',
  templateUrl: './service-drivers.component.html',
  styleUrls: ['./service-drivers.component.css']
})
export class ServiceDriversComponent {
  searchIcon = faSearch;
  checkIcon = faCheck;
  arrowRight = faArrowRight;
}
