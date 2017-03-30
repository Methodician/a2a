import { UserInfo, UserInfoClosed, UserInfoOpen } from './../models/user-info';
import { AuthService } from './../security/auth.service';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class UserService {

  userInfo$: BehaviorSubject<UserInfo> = new BehaviorSubject<UserInfo>(null);
  userInfoPrivate$: BehaviorSubject<UserInfoClosed> = new BehaviorSubject<UserInfoClosed>(null);
  userInfoOpen$: BehaviorSubject<UserInfoOpen> = new BehaviorSubject<UserInfoOpen>(null);
  orgApproved$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  uid: string = null;

  constructor(
    private authSvc: AuthService,
    private db: AngularFireDatabase
  ) {
    //  after ridiculous time and effort and no legable errors, I found that
    //  this subscribe must be in the constructor, not ngOnInit()...
    this.authSvc.authInfo$.subscribe(info => {
      console.log('UserService auth info:', info);
      this.uid = info.$uid;
      this.getUserInfo().subscribe(info => {
        if (info.$key != "null") {
          info.$uid = info.$key;
          this.userInfo$.next(info);
        }
      });
      /*this.db.object(`userInfo/${info.$uid}`).subscribe(info => {
        this.userInfo$.next(info);
      });*/
      /*this.userInfo$ = this.db.object(`userInfo/${info.$uid}`);*/
    });
  }
  updateUserInfo(userInfo, uid?) {
    let id = uid || this.uid;
    return this.db.object(`userInfo/${id}`).update(userInfo);
  }

  getUserInfo(uid?): Observable<any> {
    let id = uid || this.uid;
    //console.log('Uid in UserService.getUserInfo:', id);
    //let approved =null;
    //let open = {};
    //let closed = {};
    let subject = new Subject();
    if (!!id) {
      this.db.object(`userInfo/${id}/orgApproved`).subscribe(approved => {
        this.getOpenInfo().subscribe(open => {
          this.getClosedInfo().subscribe(closed => {
            let userInfo = Object.assign({}, { orgApproved: approved.$value }, open, closed);
            userInfo.$key = id;
            userInfo.$uid = id;
            subject.next(userInfo);
            subject.complete();
          });
        });
      });
    }
    //else subject.complete();
    //return this.db.object(`userInfo/${id}`);
    return subject.asObservable();
  }

  getOpenInfo(uid?) {
    let id = uid || this.uid;
    return this.db.object(`userInfo/${id}/open`);
  }

  getClosedInfo(uid?) {
    let id = uid || this.uid;
    return this.db.object(`userInfo/${id}/closed`);
  }

}
