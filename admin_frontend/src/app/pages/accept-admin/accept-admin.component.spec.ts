import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptAdminComponent } from './accept-admin.component';

describe('AcceptAdminComponent', () => {
  let component: AcceptAdminComponent;
  let fixture: ComponentFixture<AcceptAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
