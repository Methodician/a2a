import { Subject, Observable } from 'rxjs/Rx';
import { AngularFireDatabase, FirebaseRef, FirebaseApp } from 'angularfire2';
import { AuthService } from './../security/auth.service';
import { Injectable, Inject } from '@angular/core';


@Injectable()
export class NeedService {
  dbRef: any;
  fsRef: any;
  constructor(
    private authSvc: AuthService,
    private db: AngularFireDatabase,
    @Inject(FirebaseRef) fb,
    @Inject(FirebaseApp) app,
  ) {
    this.dbRef = fb.database().ref();
    this.fsRef = app.storage().ref();
  }

  createNewNeed(orgId: string, need: any): Observable<any> { /* , coverImage: any, bodyImages?: any[]) */

    const needToSave = Object.assign({}, need, { orgId });

    const newNeedKey = this.dbRef.child('needs').push().key;

    let dataToSave = {};

    dataToSave[`needs/${newNeedKey}`] = needToSave;
    dataToSave[`needsPerOrg/${orgId}/${newNeedKey}`] = true;

    return this.firebaseUpdate(dataToSave);
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
