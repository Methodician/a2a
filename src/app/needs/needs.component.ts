import { NeedService } from './../shared/data-services/need.service';
import { Need } from './../shared/models/need';
//import { FirebaseListObservable } from 'angularfire2';
import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'app-needs',
  templateUrl: './needs.component.html',
  styleUrls: ['./needs.component.css']
})
export class NeedsComponent implements OnInit {

  needs: Need[] = [];
  //needs: Observable<Need[]> = new Observable<Need[]>(null);
  constructor(
    private needSvc: NeedService
  ) { }

  ngOnInit() {
    //this.needs = this.needSvc.getAllNeeds();
    this.needSvc.getNeedsByApproval(true)
      .subscribe(needs => {
        this.needs = needs;
      });
  }

}
