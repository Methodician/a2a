import { Router } from '@angular/router';
import { SpotlightService } from './../shared/data-services/spotlight.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spotlights',
  templateUrl: './spotlights.component.html',
  styleUrls: ['./spotlights.component.css', '../needs/needs.component.css']
})
export class SpotlightsComponent implements OnInit {
  spotlights: any;
  constructor(
    private spotlightSvc: SpotlightService,
    private router: Router
  ) { }

  ngOnInit() {
    this.spotlightSvc.getActiveSpotlights().subscribe(spotlights => this.spotlights = spotlights);
  }

}
