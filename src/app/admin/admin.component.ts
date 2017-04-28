import { Need } from './../shared/models/need';
import { NeedService } from './../shared/data-services/need.service';
import { FinancialService } from './../shared/data-services/financial.service';
import { UserInfoOpen, UserInfo } from './../shared/models/user-info';
import { FirebaseListObservable } from 'angularfire2';
import { UserService } from './../shared/data-services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css', '../needs/needs.component.css']
})
export class AdminComponent implements OnInit {

  private users: UserInfoOpen[];
  private needs: Need[] = null;
  private selectedUser: any;
  private payouts: any[];
  private selectedPayout: any;

  private total: number;
  private fees: number;
  private subtotal: number;
  private payoutTotal: number;
  private contributionIds: string[];

  constructor(
    private userSvc: UserService,
    private finSvc: FinancialService,
    private needSvc: NeedService
  ) { }

  ngOnInit() {
    this.userSvc.getUserList().take(1).subscribe(list => {
      this.selectUser(list[0]);
      this.users = list;
    });
  }

  selectUser(user) {
    this.needs = null;
    this.selectedPayout = null;
    let id = user.$key
    this.getContributions(id);
    //this.calculateContributionTotal();
    this.userSvc.getClosedInfo(id).take(1).subscribe(details => {
      this.userSvc.isOrgApproved(id).take(1).subscribe(approved => {
        this.selectedUser = Object.assign(user, details, { isApproved: approved });
      })
    });
    this.needSvc.getNeedsByOrg(user.$key).subscribe(needs => {
      this.needs = needs;
    });
  }

  selectPayout(payout) {
    this.selectedPayout = payout;
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

    for (let cid of this.contributionIds) {
      this.sumContributionData(cid);
    }
    this.sumPayoutsOnRecord(uid);
  }

  sumContributionData(cid) {
    this.finSvc.getContributionTotal(cid).subscribe(contribution => {
      if (contribution.$value)
        this.total += parseFloat(contribution.$value || 0);
    });
    this.finSvc.getContributionFee(cid).subscribe(fee => {
      if (fee.$value)
        this.fees += parseFloat(fee.$value || 0);
    });
    this.finSvc.getContributionSubtotal(cid).subscribe(subtotal => {
      if (subtotal.$value)
        this.subtotal += parseFloat(subtotal.$value || 0);
    });
  }

  sumPayoutsOnRecord(uid) {
    this.finSvc.getPayoutsPerOrg(uid).take(1).subscribe(payouts => {
      this.payoutTotal = 0;
      this.payouts = [];
      console.log(payouts);
      this.payouts = payouts;
      for (let pay of payouts) {
        this.payoutTotal += parseFloat(pay.amount || 0);
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

  recordPayout(amount: number, note: string) {
    if (confirm('This will create a payout record. You can edit or delete it by selecting it in Financials Overview.')) {
      this.finSvc.recordPayout(this.selectedUser.$key, amount, note);
      this.calculateTotals(this.selectedUser.$key);
    }
  }

  editPayout() {
    if (confirm('Are you sure you want to edit an existing payout? This CANNOT BE UNDONE.')) {
      this.finSvc.editPayout(this.selectedUser.$key, this.selectedPayout);
      this.calculateTotals(this.selectedUser.$key);
    }
  }

  deletePayout() {
    if (confirm('This will delete the payout from records. This CANNOT BE UNDONE. Are you sure?')) {
      this.finSvc.deletePayout(this.selectedUser.$key, this.selectedPayout.$key);
      this.calculateTotals(this.selectedUser.$key);
    }
  }

  toggleApproved() {
    this.userSvc.setUserApproval(!this.selectedUser.isApproved, this.selectedUser.$key);
    this.selectUser(this.selectedUser);
  }



  //TEMP POSSIBLY USEFUL CODE FOR TRANSFERRING CONTRIBUTIONS BETWEEN ORG
  /*moveContributionOrgNode(oldKey) {
    this.finSvc.moveContributionOrgNode(oldKey, this.selectedUser.$key);
  }*/


}

