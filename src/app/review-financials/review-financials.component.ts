import { FinancialService } from './../shared/data-services/financial.service';
import { UserInfoOpen, UserInfo } from './../shared/models/user-info';
import { FirebaseListObservable } from 'angularfire2';
import { UserService } from './../shared/data-services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-review-financials',
  templateUrl: './review-financials.component.html',
  styleUrls: ['./review-financials.component.css']
})
export class ReviewFinancialsComponent implements OnInit {
  private users: UserInfoOpen[];
  private selectedUser: any;

  private total: number;
  private fees: number;
  private subtotal: number;
  private payoutTotal: number;
  private payouts: any[];
  private contributionIds: string[];

  constructor(
    private userSvc: UserService,
    private finSvc: FinancialService
  ) { }

  ngOnInit() {
    this.userSvc.getUserList().take(1).subscribe(list => {
      this.selectUser(list[0]);
      this.users = list;
    });
  }

  selectUser(user) {
    let id = user.$key
    this.getContributions(id);
    //this.calculateContributionTotal();
    this.userSvc.getClosedInfo(id).take(1).subscribe(details => {
      this.userSvc.isOrgApproved(id).take(1).subscribe(approved => {
        this.selectedUser = Object.assign(user, details, { isApproved: approved });
      })
    });

  }

  getContributions(id) {
    this.finSvc.getContributionsPerOrg(id).subscribe(ids => {
      this.contributionIds = ids.map(id => id.$key);
      //this.calculateContributionTotal();
      this.calculateTotals(id);
    });
  }

  calculateTotals(uid) {
    this.total = 0;
    this.subtotal = 0;
    this.fees = 0;
    this.payoutTotal = 0;
    this.payouts = [];
    for (let cid of this.contributionIds) {
      this.finSvc.getContributionTotal(cid).subscribe(contribution => {
        if (contribution.$value)
          this.total += parseFloat(contribution.$value);
      });
      this.finSvc.getContributionFee(cid).subscribe(fee => {
        if (fee.$value)
          this.fees += parseFloat(fee.$value);
      });
      this.finSvc.getContributionSubtotal(cid).subscribe(subtotal => {
        if (subtotal.$value)
          this.subtotal += parseFloat(subtotal.$value);
      });
    }
    this.finSvc.getPayoutsPerOrg(uid).subscribe(payouts => {
      console.log(payouts);
      this.payouts = payouts;
      for (let pay of payouts) {
        this.payoutTotal += parseFloat(pay.$value);
      }
    });
  }

  a2aFee() {
    return this.total * 0.05;
  }

  payoutSubTotal() {
    return this.subtotal - this.a2aFee();
  }

  pendingPayouts() {
    return this.payoutSubTotal() - this.payoutTotal;
  }

  recordPayout(amount: number) {
    this.finSvc.recordPayout(this.selectedUser.$key, amount);
    this.calculateTotals(this.selectedUser.$key);
  }


  //TEMP POSSIBLY USEFUL CODE FOR TRANSFERRING CONTRIBUTIONS BETWEEN ORG
  /*moveContributionOrgNode(oldKey) {
    this.finSvc.moveContributionOrgNode(oldKey, this.selectedUser.$key);
  }*/


}
