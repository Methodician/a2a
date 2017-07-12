import { UserInfo, UserInfoClosed, UserInfoOpen } from './../models/user-info';
import { AuthService } from './../security/auth.service';
import { Injectable, Inject } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import * as firebase from 'firebase';

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
    //@Inject(FirebaseRef) fb
  ) {
    //this.dbRef = fb.database().ref();
    this.dbRef = firebase.database().ref();
    //  after ridiculous time and effort and no legable errors, I found that
    //  this subscribe must be in the constructor, not ngOnInit()...
    this.authSvc.authInfo$.subscribe(info => {
      this.uid = info.$uid;
      this.getUserInfo().subscribe(info => {
        if (info.$key != "null") {
          info.$uid = info.$key;
          this.userInfo$.next(info);
        }
      });
    });
  }

  isAdmin() {
    let sub = new Subject();
    this.authSvc.authInfo$.subscribe(info => {
      if (info.$uid) {
        this.db.object(`userInfo/isAdmin/${info.$uid}`).subscribe(admin => {
          sub.next(admin.$value);
          sub.complete();
        });
      }
    });
    return sub.asObservable();
  }

  isOrgApproved(uid?: string) {
    let sub = new Subject();
    if (!!uid) {
      this.db.object(`userInfo/isApproved/${uid}`).subscribe(approved => {
        sub.next(approved.$value);
        sub.complete();
      });
    }
    else {
      this.authSvc.authInfo$.subscribe(info => {
        if (info.$uid) {
          this.db.object(`userInfo/isApproved/${info.$uid}`).subscribe(approved => {
            sub.next(approved.$value);
            sub.complete();
          });
        }
      });
    }

    return sub.asObservable();
  }

  setUserApproval(approved: boolean, uid: string) {
    this.db.object(`userInfo/isApproved/${uid}`).set(approved);
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
    userToUpdate[`userInfo/closed/${uid}`] = closedInfo;
    userToUpdate[`userInfo/open/${uid}`] = openInfo;
    return this.firebaseUpdate(userToUpdate);
  }

  getUserList() {
    return this.db.list('userInfo/open');
  }

  getUserInfo(uid?): Observable<any> {
    let id = uid || this.uid;
    let subject = new Subject();
    if (!!id) {
      this.isOrgApproved(id).subscribe(approved => {
        this.getOpenInfo(id).subscribe(open => {
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
    return subject.asObservable();
  }

  getOpenInfo(uid?) {
    let id = uid || this.uid;
    return this.db.object(`userInfo/open/${id}`);
  }

  getClosedInfo(uid?) {
    let id = uid || this.uid;
    return this.db.object(`userInfo/closed/${id}`);
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
