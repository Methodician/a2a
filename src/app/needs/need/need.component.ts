import { NeedService } from './../../shared/data-services/need.service';
import { Need } from './../../shared/models/need';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'need',
  templateUrl: './need.component.html',
  styleUrls: ['./need.component.css']
})
export class NeedComponent implements OnInit {
  @Input() need: Need;
  @Input() detail = false;
  @Input() approving = false;
  @Input() orgInfo = null;

  //@Output() approvalChanged = new EventEmitter();

  //contributions = [];
  donated = 0;

  private contributionId: string;

  constructor(private needSvc: NeedService) {
    this.contributionId = this.needSvc.createContributionId();
  }

  ngOnInit() {
    this.needSvc.getContributionsByNeed(this.need.$key)
      .subscribe(contributions => {
        //this.contributions = contributions;
        for (let cont of contributions) {
          this.needSvc.getContributionTotal(cont.$key)
            .subscribe(total => {
              if (total.$value)
                this.donated += parseFloat(total.$value);
            });
        }
      });
    /*.subscribe(contributions => {
      this.contributions = contributions;
      console.log(this.contributions);
      let i = 0;
      let len = this.contributions.length;
      if (len > 0) {
        while (i < this.contributions.length) {
          this.needSvc.getContributionTotal(this.contributions[i].$key)
            .subscribe(total => {
              console.log('contribution BEFORE:', this.contributions[i]);
              console.log('total:', total);
              if (total.$value) {
                this.contributions[i] = total.$value;
                i++;
              }
              else {
                this.contributions.splice(i, 1);
              }
              console.log('contribution AFTER:', this.contributions[i]);
              console.log(this.contributions);
            });
        }
      }*/
  }

  toggleApproval() {
    //this.approvalChanged.emit(!this.need.approved);
    this.needSvc.setNeedApproval(this.need.$key, !this.need.approved);
  }

  donate() {
    let donationInfo = {
      //buttonId: btnId,
      needId: this.need.$key,
      orgId: this.need.orgId,
      timeStamp: Date.now()
    };
    this.needSvc.donate(donationInfo, this.contributionId);
    this.contributionId = this.needSvc.createContributionId();
    /*console.log(donationInfo);*/
    /*console.log('Button ID:', btnId);
    console.log('Need:', this.need);
    console.log('Organization:', this.orgInfo);*/
  }

  pendingPercent() {
    //return Math.round(((this.need.needTotal - this.need.collectedTotal) / this.need.needTotal));
    return Math.round(100 * ((this.need.needTotal - this.donated) / this.need.needTotal));
  }

  oneDay = 24 * 60 * 60 * 1000;
  daysLeft() {
    return Math.round(Math.abs(((new Date(this.need.endDate).getTime() - new Date(Date.now()).getTime()) / this.oneDay)));
  }

}
