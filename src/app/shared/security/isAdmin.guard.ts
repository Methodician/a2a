import { UserService } from './../data-services/user.service';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';



@Injectable()
export class IsAdminGuard implements CanActivate {

    constructor(private userSvc: UserService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.userSvc.isAdmin()
            .map((admin: any) =>
                admin ? admin.$value : false
            )
            .take(1)
            .do(allowed => {
                if (!allowed) {
                    alert('This part of the site can only be accessed by an administrator. Please contact an administrator.');
                    this.router.navigate(['/login']);
                }
            });
    }
}