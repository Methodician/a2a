import { AuthInfo } from './../shared/security/auth-info';
import { UserService } from './../shared/data-services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../shared/security/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
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
      repEmail: ['', Validators.required],
      password: ['', Validators.required],
      confirm: ['', Validators.required],
      fName: ['', Validators.required],
      lName: ['', Validators.required],
      repPhone: ['', Validators.required],
      orgName: ['', Validators.required],
      orgPhone: '',
      orgWebsite: '',
      orgCity: ['', Validators.required],
      orgState: ['', Validators.required],
      orgZip: ['', Validators.required],
      agreedToTnC: [false, Validators.requiredTrue],
      orgApproved: false
    });
  }

  ngOnInit() {
    //TESTINGH
    this.authSvc.authInfo$.subscribe(info => console.log);
  }

  isPasswordMatch() {
    const val = this.form.value;
    return val.password && val.password == val.confirm;
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
