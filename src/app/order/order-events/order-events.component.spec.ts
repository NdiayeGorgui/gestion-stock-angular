import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderEventsComponent } from './order-events.component';

describe('OrderEventsComponent', () => {
  let component: OrderEventsComponent;
  let fixture: ComponentFixture<OrderEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
