import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from "@angular/common";

@Component({
  selector: 'app-post-need',
  templateUrl: './post-need.component.html',
  styleUrls: ['./post-need.component.css']
})
export class PostNeedComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      videoUrl: '',
      perpetual: false,
      needTotal: 0,
      endDate: datePipe.transform(new Date(), 'y-MM-dd'),
      startDate: datePipe.transform(new Date(), 'y-MM-dd')
    });
  }

  ngOnInit() {
  }

}
