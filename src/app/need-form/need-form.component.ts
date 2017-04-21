import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

//import { validateNeedTotal } from '../shared/validators/validateNeedTotal';

@Component({
  selector: 'need-form',
  templateUrl: './need-form.component.html',
  styleUrls: ['./need-form.component.css', '../shared/styles/validation.css']
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
      videoIframe: '',
      ongoing: false,
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

  isNeedOngoing() {
    return this.form.controls['ongoing'].value;
  }

  isErrorVisible(field: string, error: string) {
    let control = this.form.controls[field];
    return control.dirty && control.errors && control.errors[error];
  }

  isTotalOk() {
    let total = this.form.controls['needTotal'].value;
    if (this.isNeedOngoing() || total > 0)
      return true;
    else return false;
  }

  isStartOk() {
    let ctrl = this.form.controls['startDate'];
    let val = ctrl.value;
    let start = Date.parse(val);
    let today = new Date().setUTCHours(0, 0, 0, 0);

    let startOk = start >= today;

    if (ctrl.dirty)
      return (this.isNeedOngoing() || startOk)
    return true;
  }

  isEndOk() {
    let ctrl = this.form.controls['endDate'];
    let end = Date.parse(ctrl.value);
    let start = Date.parse(this.form.controls['startDate'].value);
    let endOk = end > start;
    if (ctrl.dirty)
      return (this.isNeedOngoing() || endOk)
    return true;
  }

  areDatesOk() {
    return this.isStartOk() && this.isEndOk();
  }

  reset() {
    this.form.reset();
  }

  get valid() {
    return this.form.valid && this.isTotalOk() && this.areDatesOk();
  }

  get value() {
    return this.form.value;
  }


}
