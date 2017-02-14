import { NeedService } from './../../shared/data-services/need.service';
import { Need } from './../../shared/models/need';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'need',
  templateUrl: './need.component.html',
  styleUrls: ['./need.component.css']
})
export class NeedComponent implements OnInit {
  @Input() need: Need;
  @Input() detail = false;
  @Input() orgInfo = null;
  constructor(private needSvc: NeedService) { }

  ngOnInit() {
  }

  donate(btnId) {
    let donationInfo = {
      buttonId: btnId,
      needId: this.need.$key,
      orgId: this.need.orgId,
      timeStamp: Date.now()
    };
    this.needSvc.donate(donationInfo);
    /*console.log(donationInfo);*/
    /*console.log('Button ID:', btnId);
    console.log('Need:', this.need);
    console.log('Organization:', this.orgInfo);*/
  }

  pendingPercent() {
    //return Math.round(((this.need.needTotal - this.need.collectedTotal) / this.need.needTotal));
    return Math.round(1 - 100 * ((this.need.needTotal - 1000) / this.need.needTotal));
  }

  oneDay = 24 * 60 * 60 * 1000;
  daysLeft() {
    return Math.round(Math.abs(((new Date(this.need.endDate).getTime() - new Date(Date.now()).getTime()) / this.oneDay)));
  }

}
