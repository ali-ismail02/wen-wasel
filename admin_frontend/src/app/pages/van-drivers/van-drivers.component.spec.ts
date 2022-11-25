import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VanDriversComponent } from './van-drivers.component';

describe('VanDriversComponent', () => {
  let component: VanDriversComponent;
  let fixture: ComponentFixture<VanDriversComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VanDriversComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VanDriversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
