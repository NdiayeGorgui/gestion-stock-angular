
import { Component , Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-confirm-dialog',
  standalone: false,
  templateUrl: './add-confirm-dialog.component.html',
  styleUrl: './add-confirm-dialog.component.css'
})
export class AddConfirmDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<AddConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  confirm() {
    this.dialogRef.close(true);
  }

}
