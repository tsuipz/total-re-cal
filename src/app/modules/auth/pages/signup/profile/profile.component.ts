import {
  Component,
  inject,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { ProfileFormService } from './profile.form.service';
import { UnitSystem } from '@models/types';

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  @Output() byNext = new EventEmitter<void>();
  @Output() byBack = new EventEmitter<void>();

  private profileFormService = inject(ProfileFormService);

  public profileForm = this.profileFormService.form;
  public isSubmitting = false;

  get unitSystem() {
    return this.profileForm.controls.unitSystem.value;
  }

  setUnitSystem(system: UnitSystem): void {
    this.profileForm.controls.unitSystem.setValue(system);
  }

  onContinue(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.byNext.emit();
  }

  onBackClick(): void {
    this.byBack.emit();
  }
}
