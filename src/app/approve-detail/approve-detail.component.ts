import { UserService } from './../shared/data-services/user.service';
import { NeedService } from './../shared/data-services/need.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInfo } from './../shared/models/user-info';
import { Need } from './../shared/models/need';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-approve-detail',
  templateUrl: './approve-detail.component.html',
  styleUrls: ['./approve-detail.component.css']
})
export class ApproveDetailComponent implements OnInit {

  needId: string;
  need: Need;
  orgInfo: UserInfo;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private needSvc: NeedService,
    private userSvc: UserService
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.needId = this.route.snapshot.params['id'];
    this.needSvc.getNeedById(this.needId).subscribe(need => {
      this.needSvc.getNeedImages(need);
      this.need = need;
      this.userSvc.getUserInfo(need.orgId).subscribe(info => this.orgInfo = info);
    });
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
