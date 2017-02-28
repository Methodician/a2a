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

  needs: Need[] = null;
  setsOf3: any = null;
  //needs: Observable<Need[]> = new Observable<Need[]>(null);
  constructor(
    private needSvc: NeedService
  ) { }

  ngOnInit() {
    //this.needs = this.needSvc.getAllNeeds();
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
      /*if(i+1 % 3 === 0 || i === 0){
        arrOfArr.push
      }*/
    }
    this.setsOf3 = arrOfArr;
  }

}
