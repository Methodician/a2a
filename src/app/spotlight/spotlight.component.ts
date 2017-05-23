import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'spotlight',
  templateUrl: './spotlight.component.html',
  styleUrls: ['./spotlight.component.css', '../need/need.component.css']
})
export class SpotlightComponent implements OnInit {
  @Input() spotlight;

  @Input() previewImageUrl = '../../assets/images/electric_arc.jpg';

  constructor() { }

  ngOnInit() {
    this.spotlight = {
      title: 'Im so good'
    };
  }

}
