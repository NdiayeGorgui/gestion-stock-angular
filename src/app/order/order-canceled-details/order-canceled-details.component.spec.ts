import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCanceledDetailsComponent } from './order-canceled-details.component';

describe('OrderCanceledDetailsComponent', () => {
  let component: OrderCanceledDetailsComponent;
  let fixture: ComponentFixture<OrderCanceledDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderCanceledDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderCanceledDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
