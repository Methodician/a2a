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
    let start = Date.parse(this.form.controls['startDate'].value);
    let today = new Date().setUTCHours(0, 0, 0, 0);

    let startOk = start >= today;
// <<<<<<< c9c342f1f8b33817fa536fb95c084501adf89f36
//     if (this.isNeedOngoing() || startOk)
//       return true;
//     else return false;
// =======
    //let startOk = this.form.controls['startDate'].value >= new Date(Date.now());
    if (ctrl.dirty)
      return (this.isNeedOngoing() || startOk)
    return true;
//>>>>>>> small update to need form and working financials
  }

  isEndOk() {
    let ctrl = this.form.controls['endDate'];
    let end = Date.parse(this.form.controls['endDate'].value);
    let start = Date.parse(this.form.controls['startDate'].value);
    let endOk = end > start;
// <<<<<<< c9c342f1f8b33817fa536fb95c084501adf89f36
//     if (this.isNeedOngoing() || endOk)
//       return true;
//     else return false;
// =======
    //let endOk = end > today && end > start;
    //let endOk = this.form.controls['endDate'].value > new Date(Date.now()).setDate(new Date(Date.now()).getDate() + 1);
    //let endOk = this.form.controls['endDate'].value > new Date(Date.now());
    if (ctrl.dirty)
      return (this.isNeedOngoing() || endOk)
    return true;
//>>>>>>> small update to need form and working financials
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
