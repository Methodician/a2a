import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';



@Injectable()
export class EmailVerifiedGuard implements CanActivate {

    constructor(private authSvc: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.authSvc.authInfo$
            .map(authInfo =>
                authInfo.isEmailVerified()
            )
            .take(1)
            .do(allowed => {
                if (!allowed) {
                    let shouldResend = confirm('You need to verify your email. Do you need us to resend the link? (press "OK" to resend or "Cancel" if you already go it.)');
                    if (shouldResend)
                        this.authSvc.sendVerificationEmail();
                }
            });
    }
}