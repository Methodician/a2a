import { CollapseModule } from 'ng2-bootstrap/collapse';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
//import { RouterModule } from '@angular/router';
//import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NeedsComponent } from './needs/needs.component';
//import { AppModuleComponent } from './app-module/app-module.component';
import { AppRoutingModule } from './app-routing.module';
import { TopNavComponent } from './top-nav/top-nav.component';

export const firebaseConfig = {
  apiKey: "AIzaSyBymDlc5x-NzBC-xL5RZ1GtroML8KeV56g",
  authDomain: "aid2assist-dev.firebaseapp.com",
  databaseURL: "https://aid2assist-dev.firebaseio.com",
  storageBucket: "aid2assist-dev.appspot.com",
  messagingSenderId: "732112620096"
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NeedsComponent,
    TopNavComponent,
    //AppModuleComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    //HttpModule,
    //RouterModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    CollapseModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
