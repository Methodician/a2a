import { AuthInfo } from './../shared/security/auth-info';
import { AuthService } from './../shared/security/auth.service';
import { UserService } from './../shared/data-services/user.service';
import { UserInfo } from './../shared/models/user-info';
import { NeedService } from './../shared/data-services/need.service';
import { Need } from './../shared/models/need';
import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css', '../needs/needs.component.css']
})
export class AccountComponent implements OnInit {

  needs: Need[];
  userInfo: UserInfo;
  authInfo: AuthInfo;

  constructor(
    private needSvc: NeedService,
    private userSvc: UserService,
    private authSvc: AuthService
  ) { }

  ngOnInit() {

    this.authSvc.authInfo$
      .subscribe(info => {
        if (!!info.$uid) {
          this.authInfo = info;
          this.needSvc.getNeedsByOrg(info.$uid)
            .subscribe(needs => {
              this.needs = needs;
            });
          this.userSvc.getUserInfo(info.$uid)
            .subscribe(info => {
              this.userInfo = info;
            });
        }
      })
  }

}
