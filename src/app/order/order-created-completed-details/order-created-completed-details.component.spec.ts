import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCreatedCompletedDetailsComponent } from './order-created-completed-details.component';

describe('OrderCreatedCompletedDetailsComponent', () => {
  let component: OrderCreatedCompletedDetailsComponent;
  let fixture: ComponentFixture<OrderCreatedCompletedDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderCreatedCompletedDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderCreatedCompletedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
