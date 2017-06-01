import { SpotlightService } from './../shared/data-services/spotlight.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'spotlight',
  templateUrl: './spotlight.component.html',
  styleUrls: ['./spotlight.component.css', '../need/need.component.css']
})
export class SpotlightComponent implements OnInit {
  @Input() spotlight;
  @Input() admin = false;

  @Input() previewImageUrl = '../../assets/images/electric_arc.jpg';

  constructor(private spotlightSvc: SpotlightService) { }

  ngOnInit() {

  }

  toggleActivation(active: boolean) {
    this.spotlightSvc.toggleActivation(this.spotlight.$key, !active);
  }

}
