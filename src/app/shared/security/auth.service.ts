import { AuthInfo } from './auth-info';
import { Injectable, Inject } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { FirebaseAuthState, FirebaseAuth, FirebaseRef } from 'angularfire2';



@Injectable()
export class AuthService {

  static UNKNOWN_USER = new AuthInfo(null);

  authInfo$: BehaviorSubject<AuthInfo> = new BehaviorSubject<AuthInfo>(AuthService.UNKNOWN_USER);
  fbRef: any;

  constructor(
    private auth: FirebaseAuth,
    @Inject(FirebaseRef) fbRef
  ) {
    this.auth.subscribe(info => {
      if (info) {
        const authInfo = new AuthInfo(info.uid, info.auth.emailVerified);
        this.authInfo$.next(authInfo);
      }
    });
    this.fbRef = fbRef;
  }

  login(email, password): Observable<FirebaseAuthState> {
    return this.fromFirebaseAuthPromise(this.auth.login({ email, password }));
  }
  logout() {
    this.auth.logout();
    this.authInfo$.next(AuthService.UNKNOWN_USER);
  }
  signUp(email, password): Observable<FirebaseAuthState> {
    return this.fromFirebaseAuthPromise(this.auth.createUser({ email, password }));
  }

  fromFirebaseAuthPromise(promise): Observable<any> {
    const subject = new Subject<any>();

    promise
      .then(res => {
        const authInfo = new AuthInfo(this.auth.getAuth().uid, res.auth.emailVerified);
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
