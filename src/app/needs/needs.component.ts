import { NeedService } from './../shared/data-services/need.service';
import { Need } from './../shared/models/need';
import { FirebaseListObservable } from 'angularfire2';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-needs',
  templateUrl: './needs.component.html',
  styleUrls: ['./needs.component.css']
})
export class NeedsComponent implements OnInit {

  needs: FirebaseListObservable<Need[]> = new FirebaseListObservable<Need[]>(null);
  constructor(
    private needSvc: NeedService
  ) { }

  ngOnInit() {
    this.needs = this.needSvc.getAllNeeds();
  }

}
