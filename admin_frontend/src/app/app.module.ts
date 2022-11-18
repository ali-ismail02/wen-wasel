import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PassengersComponent } from './pages/passengers/passengers.component';
import { VanDriversComponent } from './pages/van-drivers/van-drivers.component';
import { ServiceDriversComponent } from './pages/service-drivers/service-drivers.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AcceptAdminComponent } from './pages/accept-admin/accept-admin.component'

@NgModule({
  declarations: [
    AppComponent,
    PassengersComponent,
    VanDriversComponent,
    ServiceDriversComponent,
    AcceptAdminComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }