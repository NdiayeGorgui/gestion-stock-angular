import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipOrderComponent } from './ship-order.component';

describe('ShipOrderComponent', () => {
  let component: ShipOrderComponent;
  let fixture: ComponentFixture<ShipOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShipOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
