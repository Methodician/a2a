import { AuthInfo } from './auth-info';
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { FirebaseAuthState, FirebaseAuth } from 'angularfire2';



@Injectable()
export class AuthService {

  static UNKNOWN_USER = new AuthInfo(null);

  authInfo$: BehaviorSubject<AuthInfo> = new BehaviorSubject<AuthInfo>(AuthService.UNKNOWN_USER);

  constructor(
    private auth: FirebaseAuth
    /*private db: AngularFireDatabase*/
  ) {
    this.auth.subscribe(info => {
      if (info) {
        console.log('Auth info from AuthSvc:', info);
        const authInfo = new AuthInfo(info.uid);
        this.authInfo$.next(authInfo);
      }
    });
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
        const authInfo = new AuthInfo(this.auth.getAuth().uid);
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
}
