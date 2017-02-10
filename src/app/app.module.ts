import { NeedService } from './shared/data-services/need.service';
import { DatePipe } from '@angular/common';
import { AuthGuard } from './shared/security/auth.guard';
import { UserService } from './shared/data-services/user.service';
import { AuthService } from './shared/security/auth.service';
import { CollapseModule } from 'ng2-bootstrap/collapse';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { RouterModule } from '@angular/router';
//import { HttpModule } from '@angular/http';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NeedsComponent } from './needs/needs.component';
//import { AppModuleComponent } from './app-module/app-module.component';
import { AppRoutingModule } from './app-routing.module';
import { TopNavComponent } from './top-nav/top-nav.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TesterComponent } from './tester/tester.component';
import { PostNeedComponent } from './post-need/post-need.component';
import { NeedComponent } from './needs/need/need.component';
import { NeedDetailComponent } from './need-detail/need-detail.component';
import { NeedFormComponent } from './need-form/need-form.component';
import { ReversePipe } from './shared/pipes/reverse.pipe';

export const firebaseConfig = {
  apiKey: "AIzaSyBymDlc5x-NzBC-xL5RZ1GtroML8KeV56g",
  authDomain: "aid2assist-dev.firebaseapp.com",
  databaseURL: "https://aid2assist-dev.firebaseio.com",
  storageBucket: "aid2assist-dev.appspot.com",
  messagingSenderId: "732112620096"
};

export const firebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NeedsComponent,
    TopNavComponent,
    LoginComponent,
    RegisterComponent,
    TesterComponent,
    PostNeedComponent,
    NeedComponent,
    NeedDetailComponent,
    NeedFormComponent,
    ReversePipe,
    //AppModuleComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    //HttpModule,
    //RouterModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig),
    CollapseModule.forRoot()
  ],
  providers: [
    AuthService,
    UserService,
    NeedService,
    AuthGuard,
    DatePipe,
    ReversePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
