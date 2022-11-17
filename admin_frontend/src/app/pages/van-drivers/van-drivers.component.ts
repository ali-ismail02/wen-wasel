import { Component } from '@angular/core';
import {
  faArrowRight,
  faCheck,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-van-drivers',
  templateUrl: './van-drivers.component.html',
  styleUrls: ['./van-drivers.component.css']
})
export class VanDriversComponent {
  searchIcon = faSearch;
  checkIcon = faCheck;
  arrowRight = faArrowRight;
}
