import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PassengersComponent } from './pages/passengers/passengers.component';
import { ServiceDriversComponent } from './pages/service-drivers/service-drivers.component';
import { VanDriversComponent } from './pages/van-drivers/van-drivers.component';
import { AcceptAdminComponent } from './pages/accept-admin/accept-admin.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  {
    path: 'passengers',
    component: PassengersComponent,
  },
  {
    path: 'van-drivers',
    component: VanDriversComponent,
  },
  {
    path: 'service-drivers',
    component: ServiceDriversComponent,
  },
  {
    path: 'analytics',
    component: AnalyticsComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'accept',
    component: AcceptAdminComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
