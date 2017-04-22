//import { UserInfo, UserInfoClosed, UserInfoOpen } from './../models/user-info';
//import { AuthService } from './../security/auth.service';
import { Injectable, Inject } from '@angular/core';
import { AngularFireDatabase, FirebaseRef } from 'angularfire2';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';


@Injectable()
export class FinancialService {

  dbRef: any;

  constructor(
    private db: AngularFireDatabase,
    @Inject(FirebaseRef) fb
  ) {
    this.dbRef = fb.database().ref();
  }

  getContributionTotal(id: string) {
    return this.db.object(`contributionTotalLog/${id}`);
  }

  getContributionsPerOrg(orgId: string) {
    return this.db.list(`contributionsPerOrg/${orgId}`);
  }


  //TEMP POSSIBLY USEFUL CODE FOR TRANSFERRING CONTRIBUTIONS BETWEEN ORG
  moveContributionOrgNode(oldKey, newKey) {
    this.db.list(`needsPerOrg/${oldKey}`).subscribe(contents => {
      var newCont = {};
      for (let c of contents) {
        newCont[c.$key] = c.$value;
      }
      return this.db.object(`needsPerOrg/${newKey}`).set(newCont);
    });
  }

}
