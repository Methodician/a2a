import { AuthService } from './../shared/security/auth.service';
import { NeedService } from './../shared/data-services/need.service';
import { Need } from './../shared/models/need';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';



@Component({
  selector: 'need',
  templateUrl: './need.component.html',
  styleUrls: ['./need.component.css']
})
export class NeedComponent implements OnInit {
  @Input() need: Need;
  @Input() approving = false;
  @Input() previewImageUrl = '../../assets/images/electric_arc.jpg';
  @Input() preview = false;

  donated = 0;

  constructor(
    private needSvc: NeedService,
    authSvc: AuthService) {
  }

  ngOnInit() {
    this.needSvc.getContributionsByNeed(this.need.$key)
      .subscribe(contributions => {
        this.donated = 0;
        for (let cont of contributions) {
          this.needSvc.getContributionTotal(cont.$key)
            .subscribe(total => {
              if (total.$value)
                this.donated += parseFloat(total.$value);
            });
        }
      });
  }

  pendingPercent() {
    return Math.round(100 * ((this.need.needTotal - this.donated) / this.need.needTotal));
  }

  daysLeft() {
    return this.needSvc.daysLeft(this.need.endDate);
  }

}
