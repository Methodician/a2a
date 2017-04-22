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
    this.calculateContributionTotal(user.$key);
    this.userSvc.getClosedInfo(user.$key).take(1).subscribe(details => {
      this.userSvc.isOrgApproved(user.$key).take(1).subscribe(approved => {
        this.selectedUser = Object.assign(user, details, { isApproved: approved });
      })
    });

  }

  calculateContributionTotal(id) {
    this.finSvc.getContributionsPerOrg(id).subscribe(ids => {
      this.total = 0;
      for (let id of ids) {
        this.finSvc.getContributionTotal(id.$key).subscribe(contribution => {
          if (contribution.$value)
            this.total += parseFloat(contribution.$value);
        });
      }
    });
  }


  //TEMP POSSIBLY USEFUL CODE FOR TRANSFERRING CONTRIBUTIONS BETWEEN ORG
  moveContributionOrgNode(oldKey) {
    this.finSvc.moveContributionOrgNode(oldKey, this.selectedUser.$key);
  }


}
