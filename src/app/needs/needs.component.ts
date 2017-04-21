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

  needs: Need[] = null;
  constructor(
    private needSvc: NeedService
  ) { }

  ngOnInit() {
    this.needSvc.getActiveNeeds()
      .subscribe(needs => {
        this.needs = this.needSvc.filterNeedsToNotCompleted(this.needSvc.filterNeedsByApproval(needs, true));
        //this.needs = this.needSvc.filterNeedsByApproval(needs, true);
      });
  }
}
