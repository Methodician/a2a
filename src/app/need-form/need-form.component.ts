import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'need-form',
  templateUrl: './need-form.component.html',
  styleUrls: ['./need-form.component.css']
})
export class NeedFormComponent implements OnInit {

  // We're using ngOnChanges to detect and respond to changes in the Input. Cool!!! I needed that so many times.
  @Input()
  initialValue: any;

  form: FormGroup;

  constructor(fb: FormBuilder, datePipe: DatePipe) {
    this.form = fb.group({
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

  ngOnChanges(changes: SimpleChanges) {
    //  Must make sure form is initalized before checking...
    //if (changes['initialValue'] && changes['initialValue'].currentValue) {
    if (changes['initialValue']) {
      // We have two methods to set a form's value: setValue and patchValue.
      this.form.patchValue(changes['initialValue'].currentValue);
    }

  }

  isErrorVisible(field: string, error: string) {
    let control = this.form.controls[field];
    return control.dirty && control.errors && control.errors[error];
  }

  reset() {
    this.form.reset();
  }

  get valid() {
    return this.form.valid;
  }

  get value() {
    return this.form.value;
  }

}
