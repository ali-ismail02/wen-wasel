import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PassengersComponent } from './pages/passengers/passengers.component';
import { VanDriversComponent } from './pages/van-drivers/van-drivers.component';

@NgModule({
  declarations: [
    AppComponent,
    PassengersComponent,
    VanDriversComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
