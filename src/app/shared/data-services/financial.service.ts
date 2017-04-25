//import { UserInfo, UserInfoClosed, UserInfoOpen } from './../models/user-info';
//import { AuthService } from './../security/auth.service';
import { Injectable, Inject } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireDatabase, FirebaseRef, AngularFire } from 'angularfire2';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';


@Injectable()
export class FinancialService {

  dbRef: any;
  constructor(
    private db: AngularFireDatabase,
    @Inject(FirebaseRef) fb,
  ) {
    this.dbRef = fb.database().ref();
  }

  getContributionTotal(id: string) {
    return this.db.object(`contributionTotalLog/${id}`);
  }

  getContributionSubtotal(id: string) {
    return this.db.object(`contributionSubtotalLog/${id}`);
  }

  getContributionFee(id: string) {
    return this.db.object(`contributionFeeLog/${id}`);
  }

  getContributionsPerOrg(id: string) {
    return this.db.list(`contributionsPerOrg/${id}`);
  }

  getPayoutsPerOrg(id: string) {
    return this.db.list(`payoutsPerOrg/${id}`);
  }

  recordPayout(orgId: string, amount: number, note: string) {
    let timestamp = firebase.database.ServerValue.TIMESTAMP;
    let payout = {
      amount,
      note,
      timestamp
    }
    return this.db.list(`payoutsPerOrg/${orgId}`).push(payout);
  }

  editPayout(orgId: string, payout: any) {
    let newPayoutInfo = {
      amount: payout.amount,
      note: payout.note
    }
    return this.db.object(`payoutsPerOrg/${orgId}/${payout.$key}`).update(newPayoutInfo);
  }

  deletePayout(orgId: string, payoutId: string) {
    return this.db.object(`payoutsPerOrg/${orgId}/${payoutId}`).remove();
  }


  //TEMP POSSIBLY USEFUL CODE FOR TRANSFERRING CONTRIBUTIONS BETWEEN ORG
  /*moveContributionOrgNode(oldKey, newKey) {
    this.db.list(`needsPerOrg/${oldKey}`).subscribe(contents => {
      var newCont = {};
      for (let c of contents) {
        newCont[c.$key] = c.$value;
      }
      return this.db.object(`needsPerOrg/${newKey}`).set(newCont);
    });
  }*/

}
