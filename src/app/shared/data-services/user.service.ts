import { AuthService } from './../security/auth.service';
import { Injectable, OnInit, Inject, forwardRef } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2';
//import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class UserService implements OnInit {

  //userInfo$: FirebaseObjectObservable<any> = new FirebaseObjectObservable<any>(null);
  uid = null;

  constructor(
    private authSvc: AuthService,
    private db: AngularFireDatabase
  ) {
    //  after ridiculous time and effort and no legable errors, I found that
    //  this subscribe needs to be in the constructor, not ngOnInit()...
    this.authSvc.authInfo$.subscribe(info => {
      console.log('UserService auth info:', info);
      this.uid = info.$uid;      
      /*this.userInfo$ = this.db.object(`userInfo/${info.$uid}`);*/
    });
  }

  ngOnInit() {

  }
  updateUserInfo(userInfo, uid?) {
    var id;
    if (!uid)
      id = this.uid;
    else id = uid;
    return this.db.object(`userInfo/${id}`).update(userInfo);
  }

  getUserInfo() {
    console.log('Uid in UserService.getUserInfo:', this.uid);
    return this.db.object(`userInfo/${this.uid}`);
  }

}
