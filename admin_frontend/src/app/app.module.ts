import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PassengersComponent } from './pages/passengers/passengers.component';
import { VanDriversComponent } from './pages/van-drivers/van-drivers.component';
import { ServiceDriversComponent } from './pages/service-drivers/service-drivers.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AcceptAdminComponent } from './pages/accept-admin/accept-admin.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { GoogleChartsModule } from 'angular-google-charts';

@NgModule({
  declarations: [
    AppComponent,
    PassengersComponent,
    VanDriversComponent,
    ServiceDriversComponent,
    AcceptAdminComponent,
    AnalyticsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    GoogleChartsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
