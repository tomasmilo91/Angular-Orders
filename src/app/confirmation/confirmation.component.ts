import { MatDialogRef } from '@angular/material/dialog';
import { Component } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.less'],
})
export class ConfirmationComponent {
  public confirmMessage: string;
  constructor(public dialogRef: MatDialogRef<ConfirmationComponent>) {}
}
