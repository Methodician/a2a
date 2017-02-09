import { AuthService } from './../shared/security/auth.service';
import { NeedService } from './../shared/data-services/need.service';
//import { Router } from '@angular/router';
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

  coverImage: any;
  bodyImages: any;

  constructor(
    private datePipe: DatePipe,
    private needSvc: NeedService,
    authSvc: AuthService
  ) {
    authSvc.authInfo$.subscribe(info =>
      this.orgId = info.$uid
    );
  }

  ngOnInit() {
    console.log('Organization ID in post-need.comp:', this.orgId);
  }

  coverImageChange(event) {
    console.log('cover image changed');
    this.coverImage = event.srcElement.files[0];
    console.log(this.coverImage);
  }

  bodyImagesChange(event) {
    console.log('body images changed');
    this.bodyImages = event.srcElement.files;
    console.log(this.bodyImages);
  }

  save(form) {
    this.needSvc.createNewNeed(this.orgId, form.value) /*, this.coverImage, this.bodyImages*/
      .subscribe(
      () => {
        alert('Need successfully posted!');
        form.reset();
      },
      err => alert(`Error creating posting need: ${err}`)
      );
  }

}
