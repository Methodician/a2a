import { AuthService } from './../shared/security/auth.service';
import { UserService } from './../shared/data-services/user.service';
import { UserInfo, UserInfoOpen } from './../shared/models/user-info';
import { Need } from './../shared/models/need';
import { NeedService } from './../shared/data-services/need.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'need-detail',
  templateUrl: './need-detail.component.html',
  styleUrls: ['../need/need.component.css', './need-detail.component.css']
})
export class NeedDetailComponent implements OnInit {
  @Input() need: Need;
  @Input() approving = false;
  @Input() orgInfo: UserInfoOpen = null;
  @Input() previewImageUrl = '../../assets/images/electric_arc.jpg';
  @Input() previewBodyImageUrls = [];
  @Input() formShown = 'none';
  @Input() preview = false;

  needId: string;
  donated = 0;

  private contributionId: string;
  private donorId: string

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private needSvc: NeedService,
    private userSvc: UserService,
    authSvc: AuthService
  ) {
    this.contributionId = this.needSvc.createContributionId();
    authSvc.authInfo$.subscribe(info => {
      this.donorId = info.$uid;
    });
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    if (this.route.snapshot.params['id']) {
      this.needId = this.route.snapshot.params['id'];
      this.needSvc.getNeedById(this.needId).subscribe(need => {
        this.needSvc.getNeedImages(need);
        this.need = need;
        this.userSvc.getOpenInfo(need.orgId).subscribe(info => this.orgInfo = info);
        this.getContributions();
      });
    }
    else
      this.getContributions();
  }

  getContributions() {
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
    this.needSvc.setNeedApproval(this.need.$key, !this.need.approved);
  }

  pendingPercent() {
    return Math.round(100 * ((this.need.needTotal - this.donated) / this.need.needTotal));
  }

  daysLeft() {
    return this.needSvc.daysLeft(this.need.endDate);
  }

}
