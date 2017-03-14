import { UserService } from './../shared/data-services/user.service';
import { UserInfo } from './../shared/models/user-info';
import { Need } from './../shared/models/need';
import { NeedService } from './../shared/data-services/need.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-need-detail',
  templateUrl: './need-detail.component.html',
  styleUrls: ['./need-detail.component.css', '../need/need.component.css']
})
export class NeedDetailComponent implements OnInit {
  //need$: FirebaseObjectObservable<Need> = null;
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
    this.needId = this.route.snapshot.params['id'];
    //this.need$ = this.needSvc.getNeedById(this.needId);
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
