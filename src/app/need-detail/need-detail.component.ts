import { Observable } from 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-need-detail',
  templateUrl: './need-detail.component.html',
  styleUrls: ['./need-detail.component.css', '../needs/need/need.component.css']
})
export class NeedDetailComponent implements OnInit {
  //need$: Observable<any>;
  needId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router/*,
    private needSvc: NeedService*/
  ) { }

  ngOnInit() {
    this.needId = this.route.snapshot.params['id'];
  }

}
