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

  constructor(
    private userSvc: UserService
  ) { }

  ngOnInit() {
    this.userSvc.getUserList().subscribe(list => this.users = list);
  }

}
