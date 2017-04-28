import { AuthInfo } from './../shared/security/auth-info';
import { UserService } from './../shared/data-services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../shared/security/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { validateUrl } from '../shared/validators/validateUrl';
import { validateEmail } from '../shared/validators/validateEmail';
import { validatePhone } from '../shared/validators/validatePhone';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../shared/styles/validation.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  authInfo: AuthInfo;

  constructor(
    private fb: FormBuilder,
    private authSvc: AuthService,
    private userSvc: UserService,
    private router: Router
  ) {
    this.form = this.fb.group({
      repEmail: ['', [validateEmail, Validators.required]],
      password: ['', Validators.required],
      confirm: ['', Validators.required],
      fName: ['', Validators.required],
      lName: ['', Validators.required],
      repPhone: ['', [validatePhone, Validators.required]],
      orgName: ['', Validators.required],
      orgPhone: ['', validatePhone],
      orgWebsite: ['', validateUrl],
      orgCity: ['', Validators.required],
      orgState: ['', Validators.required],
      orgZip: ['', Validators.required],
      agreedToTnC: [false, Validators.requiredTrue],
      orgApproved: false
    });
  }

  ngOnInit() {
  }

  isPasswordMatch() {
    const val = this.form.value;
    return val.password && val.password == val.confirm;
  }

  isControlDirty(field: string) {
    let control = this.form.controls[field];
    return control.dirty;
  }

  aggreedToTnC() {
    let control = this.form.controls['agreedToTnC'];
    return control.value;
  }
  
  isErrorVisible(field: string, error: string) {
    let control = this.form.controls[field];
    return control.dirty && control.errors && control.errors[error];
  }

  signUp() {
    const val = this.form.value;

    this.authSvc.signUp(val.repEmail, val.password)
      .subscribe(
      res => {
        console.log('Signup result from RegisterComp', res);
        delete val.password;
        delete val.confirm;
        this.authSvc.sendVerificationEmail();
        alert('Thanks for creating an account! You must respond to the verification email to complete the process. Your organization must also be approved by an administrator.');
        this.userSvc.createUser(val, res.auth.uid).subscribe(res => console.log);
        this.router.navigateByUrl('/account');
      },
      err => alert(err)
      );


  }

  formValid() {
    return this.form.valid;
  }

}
