import { UserInfo } from './../shared/models/user-info';
import { UserService } from './../shared/data-services/user.service';
import { AuthInfo } from './../shared/security/auth-info';
import { AuthService } from './../shared/security/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {
  isCollapsed: boolean = true;

  authInfo: AuthInfo = new AuthInfo(null);
  firstName: string = '';
  constructor(
    private authSvc: AuthService,
    private userSvc: UserService
  ) { }

  ngOnInit() {
    this.authSvc.authInfo$.subscribe(info => {
      this.authInfo = info;
    });
    this.userSvc.userInfo$.subscribe((info: UserInfo) => {
      if (info) {
        this.firstName = info.fName;
      }
    });
  }

  logout() {
    this.authSvc.logout();
  }

}
