import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastBookingComponent } from './past-booking.component';

describe('PastBookingComponent', () => {
  let component: PastBookingComponent;
  let fixture: ComponentFixture<PastBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PastBookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PastBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
