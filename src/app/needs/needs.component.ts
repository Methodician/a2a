import { NeedService } from './../shared/data-services/need.service';
import { Need } from './../shared/models/need';
import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'app-needs',
  templateUrl: './needs.component.html',
  styleUrls: ['./needs.component.css']
})
export class NeedsComponent implements OnInit {

  needs: Need[] = null;
  setsOf3: any = null;
  constructor(
    private needSvc: NeedService
  ) { }

  ngOnInit() {
    this.needSvc.getNeedsByApproval(true)
      .subscribe(needs => {
        this.needs = needs;
        this.setsOfThree();
      });

  }

  setsOfThree() {
    if (this.needs.length < 1)
      return;
    let i = 0;
    let row = 1;
    let arrOfArr = [];
    while (i < this.needs.length) {
      let tempArr = [];
      for (let j = 0; j < 3; j++) {
        if (this.needs[i]) {
          tempArr.push(this.needs[i])
        }
        i++;
      }
      arrOfArr.push(tempArr);
      tempArr = [];
    }
    this.setsOf3 = arrOfArr;
  }

}
