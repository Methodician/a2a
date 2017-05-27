import { UserInfoOpen } from './../shared/models/user-info';
import { SpotlightService } from './../shared/data-services/spotlight.service';
import { UserService } from './../shared/data-services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-post-spotlight',
  templateUrl: './post-spotlight.component.html',
  styleUrls: ['./post-spotlight.component.css']
})
export class PostSpotlightComponent implements OnInit {

  user: UserInfoOpen;
  orgId: string;
  spotlight: any;
  tempAccessors: any[] = [];

  previewImageUrl: any = '../../assets/images/vision2.png';
  previewBodyImageUrls: string[];
  coverImage: any;
  bodyImages: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userSvc: UserService,
    private spotlightSvc: SpotlightService
  ) { }

  ngOnInit() {
    if (this.route.snapshot.params['id']) {
      let id = this.route.snapshot.params['id'];
      this.orgId = id;

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

  ngOnDestroy() {
    this.spotlightSvc.deleteTempImages(this.tempAccessors);
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

  save(form) {
    this.spotlightSvc.createNewSpotlight(this.orgId, form.value, this.coverImage, this.bodyImages)
      .subscribe(
      () => {
        alert('Spotlight successfully added!');
        form.reset();
        this.router.navigate(['../admin']);
      },
      err => alert(`Error creating or posting spotlight: ${err}`)
      );
  }

  formValid(needFormValid) {
    let hasCoverImage = !!this.coverImage;
    return needFormValid && hasCoverImage;
  }

}
