import { NeedService } from './../shared/data-services/need.service';
import { Need } from './../shared/models/need';
import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'app-needs',
  templateUrl: './needs.component.html',
  styleUrls: ['./needs.component.css']
})

export class NeedsComponent implements OnInit {

  needs: Need[] = [];
  constructor(
    private needSvc: NeedService
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);

    this.needSvc.getActiveNeeds()
      .subscribe(needs => {
        this.needs = [];
        this.needs = this.needSvc.filterNeedsToNotCompleted(this.needSvc.filterNeedsByApproval(needs, true));
      });
  }
}
