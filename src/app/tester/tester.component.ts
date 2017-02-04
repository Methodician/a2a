import { UserService } from './../shared/data-services/user.service';
//import { AuthService } from './../shared/security/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tester',
  templateUrl: './tester.component.html',
  styleUrls: ['./tester.component.css']
})
export class TesterComponent implements OnInit {

  constructor(
    //private auth: AuthService,
    private userSvc: UserService
  ) { }

  ngOnInit() {

  }


  addUserProperty(name, value) {
    //console.log('Name:', name);
    //console.log('Value:', value);
    let property = JSON.parse(`{ "${name}": "${value}" }`);
    this.userSvc.updateUserInfo(property);
  }

}
