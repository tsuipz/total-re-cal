import { Component } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { CommonModule } from '@angular/common';
import { SignupFormService } from './signup.form.service';
import { ProfileFormService } from './profile/profile.form.service';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

const SERVICES = [SignupFormService, ProfileFormService];

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ProfileComponent, MatCardModule, MatButtonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  providers: [SERVICES],
})
export class SignupComponent {
  onHandleNext(): void {
    // Navigation will be implemented later
  }

  onHandleBack(): void {
    // Navigation will be implemented later
  }
}
