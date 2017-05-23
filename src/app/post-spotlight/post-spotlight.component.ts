import { UserInfoOpen } from './../shared/models/user-info';
import { SpotlightService } from './../shared/data-services/spotlight.service';
import { UserService } from './../shared/data-services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-post-spotlight',
  templateUrl: './post-spotlight.component.html',
  styleUrls: ['./post-spotlight.component.css']
})
export class PostSpotlightComponent implements OnInit {

  user: UserInfoOpen;
  spotlight: any;
  tempAccessors: any[] = [];

  previewImageUrl: any = '../../assets/images/vision2.png';
  previewBodyImageUrls: string[];
  coverImage: any;
  bodyImages: any;

  constructor(
    private route: ActivatedRoute,
    private userSvc: UserService,
    private spotlightSvc: SpotlightService
  ) { }

  ngOnInit() {
    if (this.route.snapshot.params['id']) {
      let id = this.route.snapshot.params['id'];

      this.spotlightSvc.getSpotlight(id).subscribe(spotlight => {
        this.userSvc.getOpenInfo(id).subscribe(user => {
          this.user = user;
          if (!spotlight.$value) {
            spotlight = {
              title: user.orgName
            }
          }
          this.spotlight = spotlight;
        });
      });
    }
  }

  coverImageChange(event) {
    this.coverImage = event.srcElement.files[0];
    this.spotlightSvc.storeTempImage(this.coverImage)
      .subscribe((imageAccessors: any) => {
        this.previewImageUrl = imageAccessors.url;
        this.tempAccessors.push(imageAccessors);
      });
  }

  bodyImagesChange(event) {
    this.bodyImages = event.srcElement.files;
    this.previewBodyImageUrls = [];
    for (let image of this.bodyImages) {
      this.spotlightSvc.storeTempImage(image)
        .subscribe((imageAccessors: any) => {
          this.previewBodyImageUrls.push(imageAccessors.url);
          this.tempAccessors.push(imageAccessors);
        });
    }
  }

  formValid(needFormValid) {
    let hasCoverImage = !!this.coverImage;
    return needFormValid && hasCoverImage;
  }

}
