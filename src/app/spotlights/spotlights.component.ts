import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spotlights',
  templateUrl: './spotlights.component.html',
  styleUrls: ['./spotlights.component.css', '../needs/needs.component.css']
})
export class SpotlightsComponent implements OnInit {
  spotlights = [1, 2, 3, 4];
  constructor() { }

  ngOnInit() {
  }

}
