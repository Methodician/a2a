import { UserInfo } from './shared/models/user-info';
import { UserService } from './shared/data-services/user.service';
import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  userInfo: UserInfo;

  constructor(private userSvc: UserService) {
  }

  ngOnInit() {
    this.userSvc.userInfo$.subscribe(info =>
      this.userInfo = info
    );
  }

}
