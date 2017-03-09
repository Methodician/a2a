import { UserService } from './../shared/data-services/user.service';
import { UserInfo } from './../shared/models/user-info';
import { AuthService } from './../shared/security/auth.service';
import { NeedService } from './../shared/data-services/need.service';
import { Router } from '@angular/router';
//import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from "@angular/common";

@Component({
  selector: 'app-post-need',
  templateUrl: './post-need.component.html',
  styleUrls: ['./post-need.component.css']
})
export class PostNeedComponent implements OnInit, OnDestroy {

  orgId: string;
  orgInfo: UserInfo;
  //needKey: string;
  tempAccessors: any[] = [];

  coverImage: any;
  bodyImages: any;
  previewImageUrl: any = '../../assets/images/vision2.png';
  previewBodyImageUrls: string[];

  constructor(
    private datePipe: DatePipe,
    private needSvc: NeedService,
    private router: Router,
    private userSvc: UserService,
    authSvc: AuthService
  ) {
    authSvc.authInfo$.subscribe(info =>
      this.orgId = info.$uid
    );
  }

  ngOnInit() {
    //console.log('Organization ID in post-need.comp:', this.orgId);
    this.userSvc.getUserInfo(this.orgId).subscribe(info => this.orgInfo = info);
    //this.needKey = this.needSvc.createNeedId();
  }

  ngOnDestroy() {
    this.needSvc.deleteTempImages(this.tempAccessors);
  }

  coverImageChange(event) {
    console.log('cover image changed');
    console.log(event);
    this.coverImage = event.srcElement.files[0];
    this.needSvc.storeTempImage(this.coverImage)
      .subscribe((imageAccessors: any) => {
        console.log(imageAccessors);
        this.previewImageUrl = imageAccessors.url;
        this.tempAccessors.push(imageAccessors);
      });
    //console.log(this.previewImageUrl);
    //console.log(this.coverImage);
  }

  bodyImagesChange(event) {
    console.log('body images changed');
    this.bodyImages = event.srcElement.files;
    this.previewBodyImageUrls = [];
    for (let image of this.bodyImages) {
      this.needSvc.storeTempImage(image)
        .subscribe((imageAccessors: any) => {
          this.previewBodyImageUrls.push(imageAccessors.url);
          this.tempAccessors.push(imageAccessors);
        });
    }
    console.log(this.bodyImages);
  }

  save(form) {
    this.needSvc.createNewNeed(this.orgId, form.value, this.coverImage, this.bodyImages)
      .subscribe(
      () => {
        alert('Need successfully posted!');
        form.reset();
        this.router.navigate(['../needs']);
      },
      err => alert(`Error creating posting need: ${err}`)
      );
  }

}
