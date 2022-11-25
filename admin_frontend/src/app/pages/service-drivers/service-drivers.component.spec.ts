import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDriversComponent } from './service-drivers.component';

describe('ServiceDriversComponent', () => {
  let component: ServiceDriversComponent;
  let fixture: ComponentFixture<ServiceDriversComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceDriversComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceDriversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
