import { Component } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.less'],
})
export class ConfirmationComponent {
  public confirmMessage: string;
  constructor(public dialogRef: MatDialogRef<ConfirmationComponent>) {}
}
