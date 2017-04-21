import { FinancialService } from './../shared/data-services/financial.service';
import { UserInfoOpen } from './../shared/models/user-info';
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
  private selectedUser: UserInfoOpen;
  constructor(
    private userSvc: UserService,
    private finSvc: FinancialService
  ) { }

  ngOnInit() {
    this.userSvc.getUserList().take(1).subscribe(list => {
      this.selectedUser = list[0];
      this.users = list;
    });
  }

  selectUser(user) {
    this.selectedUser = user;
  }

}
