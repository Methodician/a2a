import { AuthInfo } from './auth-info';
import { Injectable, Inject } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
//import { FirebaseAuthState, FirebaseAuth, FirebaseRef } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';



@Injectable()
export class AuthService {

  static UNKNOWN_USER = new AuthInfo(null);

  authInfo$: BehaviorSubject<AuthInfo> = new BehaviorSubject<AuthInfo>(AuthService.UNKNOWN_USER);
  fbRef: any;

  constructor(
    private auth: AngularFireAuth,
    //@Inject(FirebaseRef) fbRef
  ) {
    this.auth.authState.subscribe(info => {
      if (info) {
        const authInfo = new AuthInfo(info.uid, info.emailVerified);
        this.authInfo$.next(authInfo);
      }
    });
    //this.fbRef = fbRef;
  }

  login(email, password){
    return this.fromFirebaseAuthPromise(this.auth.auth.signInWithEmailAndPassword( email, password ));
  }
  logout() {
    this.auth.auth.signOut();
    this.authInfo$.next(AuthService.UNKNOWN_USER);
  }
  signUp(email, password){
    return this.fromFirebaseAuthPromise(this.auth.auth.createUserWithEmailAndPassword( email, password ));
  }

  fromFirebaseAuthPromise(promise): Observable<any> {
    const subject = new Subject<any>();

    promise
      .then(res => {
        const authInfo = new AuthInfo(this.auth.auth.currentUser.uid, res.emailVerified);
        this.authInfo$.next(authInfo);
        subject.next(res);
        subject.complete();
      },
      err => {
        this.authInfo$.error(err);
        subject.error(err);
        subject.complete();
      });
    return subject.asObservable();
  }

  sendVerificationEmail() {
    let user = this.fbRef.auth().currentUser;

    user.sendEmailVerification().then(() => {
    }, (error) => {
      alert('It looks like your verification email was not sent. Please try again or contact support.');
    });
  }
}
