import { AngularFireDatabase } from 'angularfire2';
import { AuthService } from './../security/auth.service';
import { Injectable } from '@angular/core';


@Injectable()
export class NeedService {

  constructor(
    private authSvc: AuthService,
    private db: AngularFireDatabase,
    
  ) { }

}
