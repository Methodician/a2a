import { UserService } from './../shared/data-services/user.service';
import { UserInfo } from './../shared/models/user-info';
import { AuthService } from './../shared/security/auth.service';
import { NeedService } from './../shared/data-services/need.service';
import { Router } from '@angular/router';
//import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from "@angular/common";

@Component({
  selector: 'app-post-need',
  templateUrl: './post-need.component.html',
  styleUrls: ['./post-need.component.css']
})
export class PostNeedComponent implements OnInit {

  orgId: string;
  orgInfo: UserInfo;

  coverImage: any;
  bodyImages: any;

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
  }

  coverImageChange(event) {
    //console.log('cover image changed');
    this.coverImage = event.srcElement.files[0];
    console.log(this.coverImage);
  }

  bodyImagesChange(event) {
    console.log('body images changed');
    this.bodyImages = event.srcElement.files;
    console.log(this.bodyImages);
  }

  save(form) {
    this.needSvc.createNewNeed(this.orgId, form.value, this.coverImage, this.bodyImages) /*, this.coverImage, this.bodyImages*/
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
