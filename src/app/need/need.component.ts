import { AuthService } from './../shared/security/auth.service';
import { NeedService } from './../shared/data-services/need.service';
import { Need } from './../shared/models/need';
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
  @Input() preview = false;
  @Input() previewImageUrl = '../../assets/images/electric_arc.jpg';
  @Input() previewBodyImageUrls = [];
  @Input() formShown = 'none';
  //@Output() approvalChanged = new EventEmitter();

  //contributions = [];
  donated = 0;

  private contributionId: string;
  private donorId: string

  constructor(private needSvc: NeedService, authSvc: AuthService) {
    this.contributionId = this.needSvc.createContributionId();
    authSvc.authInfo$.subscribe(info => {
      this.donorId = info.$uid;
    });
  }

  ngOnInit() {
    this.needSvc.getContributionsByNeed(this.need.$key)
      .subscribe(contributions => {
        this.donated = 0;
        for (let cont of contributions) {
          this.needSvc.getContributionTotal(cont.$key)
            .subscribe(total => {
              if (total.$value)
                this.donated += parseFloat(total.$value);
            });
        }
      });
  }

  toggleApproval() {
    //this.approvalChanged.emit(!this.need.approved);
    this.needSvc.setNeedApproval(this.need.$key, !this.need.approved);
  }

  /*  showDonateForm() {
      this.formShown = 'donate';
    }
    showSubscribeForm() {
      this.formShown = 'subscribe';
    }
    hideForms() {
      this.formShown = 'none';
    }*/

  /*  donate(subscription = false) {
      let donationInfo = {
        //buttonId: btnId,
        needId: this.need.$key,
        orgId: this.need.orgId,
        timeStamp: Date.now()
      };
      this.needSvc.donate(donationInfo, this.contributionId, subscription);
      this.contributionId = this.needSvc.createContributionId();
    }*/

  pendingPercent() {
    //return Math.round(((this.need.needTotal - this.need.collectedTotal) / this.need.needTotal));
    return Math.round(100 * ((this.need.needTotal - this.donated) / this.need.needTotal));
  }

  oneDay = 24 * 60 * 60 * 1000;
  daysLeft() {
    return Math.round(Math.abs(((new Date(this.need.endDate).getTime() - new Date(Date.now()).getTime()) / this.oneDay)));
  }

}
