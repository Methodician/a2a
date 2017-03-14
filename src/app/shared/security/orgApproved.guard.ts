import { UserService } from './../data-services/user.service';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';



@Injectable()
export class OrgApprovedGuard implements CanActivate {

    constructor(private userSvc: UserService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.userSvc.userInfo$
            .map(userInfo =>
                userInfo.orgApproved
            )
            .take(1)
            .do(allowed => {
                if (!allowed) {
                    alert('Your account must be approved by an administrator to access this URL. Please contact support if you need to be approved.');
                }
            });
    }
}