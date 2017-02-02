import { Component } from '@angular/core';
import { AngularFire, AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  allData: FirebaseObjectObservable<any>;
  constructor(af: AngularFire, private db: AngularFireDatabase) {
    console.log(af);
  }

  ngOnInit() {
    this.allData = this.db.object('/');
  }
}
