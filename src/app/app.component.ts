import { AuthService } from './shared/security/auth.service';
import { UserService } from './shared/data-services/user.service';
import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  allData: FirebaseObjectObservable<any>;
  userData: FirebaseObjectObservable<any>;

  constructor(
    private db: AngularFireDatabase,
    private userSvc: UserService,
    private authSvc: AuthService) {
    //console.log(af);
  }

  ngOnInit() {
    this.allData = this.db.object('/');
    this.authSvc.authInfo$.subscribe(() => {
      this.refreshUserInfo();
    });
    /*this.userSvc.userInfo$.subscribe(info =>
      this.userData = info
    );*/
  }

  refreshUserInfo() {
    this.userData = this.userSvc.getUserInfo();
  }
}
