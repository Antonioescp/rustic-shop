import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  imageUrl?: string;
  confirmIcon?: string;
  cancelIcon?: string;
  confirmColor?: string;
  cancelColor?: string;
}

export interface ConfirmDialogResult {
  confirmed: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
    private dialogRef: MatDialogRef<ConfirmDialogComponent, ConfirmDialogResult>,
  ) {
  }

  onConfirm(): void {
    this.dialogRef.close({
      confirmed: true,
    });
  }

}
