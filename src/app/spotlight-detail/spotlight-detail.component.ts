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

  constructor() { }

  ngOnInit() {
  }

}
