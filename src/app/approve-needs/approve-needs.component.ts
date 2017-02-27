import { Component, OnInit } from '@angular/core';
import { Need } from './../shared/models/need';
import { NeedService } from './../shared/data-services/need.service';

@Component({
  selector: 'app-approve-needs',
  templateUrl: './approve-needs.component.html',
  styleUrls: ['./approve-needs.component.css']
})
export class ApproveNeedsComponent implements OnInit {

  needs: Need[] = [];
  needSub: any;
  filter;

  constructor(
    private needSvc: NeedService
  ) { }

  ngOnInit() {
    this.filter = false;
    this.subscribeNeeds(this.filter);
  }

  handleApprovalChanged(wasChangedTo: boolean) {
    this.subscribeNeeds(this.filter);
  }

  switchFilter() {
    this.filter = !this.filter;
    this.needSub = this.subscribeNeeds(this.filter);
  }

  subscribeNeeds(filter: boolean) {
    this.needSub = this.needSvc.getNeedsByApproval(filter)
      .subscribe(needs => {
        console.log('FILTER:', this.filter);
        this.needs = needs;
      });
  }

}
