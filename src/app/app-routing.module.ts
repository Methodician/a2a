import { OrgApprovedGuard } from './shared/security/orgApproved.guard';
import { AccountComponent } from './account/account.component';
import { EmailVerifiedGuard } from './shared/security/emailVerified.guard';
import { ApproveDetailComponent } from './approve-detail/approve-detail.component';
import { ApproveNeedsComponent } from './approve-needs/approve-needs.component';
import { NeedDetailComponent } from './need-detail/need-detail.component';
import { AuthGuard } from './shared/security/auth.guard';
import { PostNeedComponent } from './post-need/post-need.component';
import { TesterComponent } from './tester/tester.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { NeedsComponent } from './needs/needs.component';
import { HomeComponent } from './home/home.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

const routes: Routes = [
    {
        path: 'home',
        children: [
            {
                path: ':id',
                redirectTo: '/needs/:id'
            },
            {
                path: '',
                component: HomeComponent
            }
        ]
    },
    {
        path: 'needs',
        children: [
            {
                path: ':id',
                component: NeedDetailComponent
            },
            {
                path: '',
                component: NeedsComponent
            }
        ]
    },
    {
        path: 'approveneeds',
        children: [
            {
                // ToDo: add an isAdminGuard and apply it here (also Firebase Security Rules)
                path: ':id',
                component: ApproveDetailComponent
            },
            {
                path: '',
                component: ApproveNeedsComponent
            }
        ]
    },
    {
        path: 'account',
        children: [
            {
                path: ':id',
                component: NeedDetailComponent
            },
            {
                path: '',
                component: AccountComponent
            }
        ],
        canActivate: [AuthGuard]
    },
    {
        path: 'postaneed',
        component: PostNeedComponent,
        canActivate: [AuthGuard, EmailVerifiedGuard, OrgApprovedGuard]
    },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'tester', component: TesterComponent },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/home',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule { }