import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConfirmDialogComponent } from './add-confirm-dialog.component';

describe('AddConfirmDialogComponent', () => {
  let component: AddConfirmDialogComponent;
  let fixture: ComponentFixture<AddConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddConfirmDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
