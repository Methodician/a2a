import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'spotlight-form',
  templateUrl: './spotlight-form.component.html',
  styleUrls: ['./spotlight-form.component.css']
})
export class SpotlightFormComponent implements OnInit {

  @Input()
  initialValue: any;

  form: FormGroup;

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      videoIframe: '',
      monthlyCommitment: 0
    });
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialValue'] && changes['initialValue'].currentValue) {
      //if (changes['initialValue']) {
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
    //return this.form.valid && this.isTotalOk() && this.areDatesOk();
    return this.form.valid;
  }

  get value() {
    return this.form.value;
  }

}
