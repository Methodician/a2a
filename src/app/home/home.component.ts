import { Need } from './../shared/models/need';
import { NeedService } from './../shared/data-services/need.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  lastNeeds: Need[];
  constructor(private needSvc: NeedService) { }

  ngOnInit() {
    this.needSvc.getLastNeeds(true)
      .subscribe(needs => {
        this.lastNeeds = needs;
      });
  }

}
