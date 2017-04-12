import { UserInfo, UserInfoClosed, UserInfoOpen } from './../models/user-info';
import { AuthService } from './../security/auth.service';
import { Injectable, Inject } from '@angular/core';
import { AngularFireDatabase, FirebaseRef } from 'angularfire2';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class UserService {

  userInfo$: BehaviorSubject<UserInfo> = new BehaviorSubject<UserInfo>(null);
  userInfoPrivate$: BehaviorSubject<UserInfoClosed> = new BehaviorSubject<UserInfoClosed>(null);
  userInfoOpen$: BehaviorSubject<UserInfoOpen> = new BehaviorSubject<UserInfoOpen>(null);
  orgApproved$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  uid: string = null;

  dbRef: any;
  constructor(
    private authSvc: AuthService,
    private db: AngularFireDatabase,
    @Inject(FirebaseRef) fb
  ) {
    this.dbRef = fb.database().ref();
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

  isAdmin() {
    let sub = new Subject();
    this.authSvc.authInfo$.subscribe(info => {
      if (info.$uid) {
        this.db.object(`userInfo/${info.$uid}/isAdmin`).subscribe(admin => {
          sub.next(admin.$value);
          sub.complete();
        });
      }
    });
    return sub.asObservable();
  }

  isOrgApproved() {
    let sub = new Subject();
    this.authSvc.authInfo$.subscribe(info => {
      if (info.$uid) {
        this.db.object(`userInfo/${info.$uid}/orgApproved`).subscribe(approved => {
          sub.next(approved.$value);
          sub.complete();
        });
      }
    });
    return sub.asObservable();
  }

  updateUserInfo(userInfo, uid?) {
    let id = uid || this.uid;
    return this.db.object(`userInfo/${id}`).update(userInfo);
  }

  createUser(userInfo, uid) {
    let userToUpdate = {};
    let closedInfo = {
      agreeToTnC: userInfo.agreedToTnC,
      repEmail: userInfo.repEmail,
      repPhone: userInfo.repPhone
    };
    let openInfo = {
      fName: userInfo.fName,
      lName: userInfo.lName,
      orgCity: userInfo.orgCity,
      orgName: userInfo.orgName,
      orgPhone: userInfo.orgPhone,
      orgState: userInfo.orgState,
      orgWebsite: userInfo.orgWebsite,
      orgZip: userInfo.orgZip
    };
    userToUpdate[`userInfo/${uid}/closed`] = closedInfo;
    userToUpdate[`userInfo/${uid}/open`] = openInfo;
    //return this.db.object(`userInfo/${uid}`).set(userInfo);
    return this.firebaseUpdate(userToUpdate);
  }

  getUserInfo(uid?): Observable<any> {
    let id = uid || this.uid;
    //console.log('Uid in UserService.getUserInfo:', id);
    //let approved =null;
    //let open = {};
    //let closed = {};
    let subject = new Subject();
    if (!!id) {
      this.isOrgApproved().subscribe(approved => {
        this.getOpenInfo().subscribe(open => {
          this.getClosedInfo().subscribe(closed => {
            let userInfo = Object.assign({}, { orgApproved: approved }, open, closed);
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

  firebaseUpdate(dataToSave) {
    const subject = new Subject();

    this.dbRef.update(dataToSave)
      .then(
      val => {
        subject.next(val);
        subject.complete();
      },
      err => {
        subject.error(err);
        subject.complete();
      }
      );

    return subject.asObservable();
  }

}
