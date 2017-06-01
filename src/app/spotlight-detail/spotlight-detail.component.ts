import { SpotlightService } from './../shared/data-services/spotlight.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'spotlight-detail',
  templateUrl: './spotlight-detail.component.html',
  styleUrls: ['./spotlight-detail.component.css', '../need/need.component.css', '../need-detail/need-detail.component.css']
})
export class SpotlightDetailComponent implements OnInit {
  @Input() spotlight: any;
  @Input() previewImageUrl = '../../assets/images/electric_arc.jpg';
  @Input() previewBodyImageUrls = [];

  spotlightId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spotlightSvc: SpotlightService
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    if (this.route.snapshot.params['id']) {
      this.spotlightId = this.route.snapshot.params['id'];
      this.spotlightSvc.getSpotlight(this.spotlightId).subscribe(spotlight => {
        this.spotlightSvc.getSpotlightImages(spotlight);
        this.spotlight = spotlight;
      })
    }
  }


}
