import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';

const MUI = [
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatIconModule,
  MatDatepickerModule,
  MatTimepickerModule,
];

export interface AddEntryDialogData {
  title: string;
  icon: string;
  nameLabel: string;
  namePlaceholder: string;
  categoryLabel: string;
  categoryPlaceholder: string;
  caloriesLabel: string;
  caloriesPlaceholder: string;
  datetimeLabel: string;
  timeLabel: string;
  submitButtonText: string;
}

export interface AddEntryFormValue {
  name: string;
  category: string;
  calories: number;
  datetime: Date;
}

export interface AddEntryFormControls {
  name: FormControl<string | null>;
  category: FormControl<string | null>;
  calories: FormControl<number | null>;
  datetime: FormControl<Date | null>;
}

export type AddEntryForm = FormGroup<AddEntryFormControls>;

@Component({
  selector: 'app-add-entry-dialog',
  imports: [CommonModule, ReactiveFormsModule, ...MUI],
  templateUrl: './add-entry-dialog.component.html',
  styleUrl: './add-entry-dialog.component.scss',
  standalone: true,
})
export class AddEntryDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AddEntryDialogComponent>);
  public data = inject<AddEntryDialogData>(MAT_DIALOG_DATA);

  public form: AddEntryForm = this.fb.group<AddEntryFormControls>({
    name: this.fb.control('', [Validators.required]),
    category: this.fb.control('', [Validators.required]),
    calories: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(0),
    ]),
    datetime: this.fb.control(new Date()),
  });

  public onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}
