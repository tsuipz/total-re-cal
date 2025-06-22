import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthActions } from '@app/core/stores/auth';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-login',
  imports: [MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private store = inject(Store);

  /**
   * Sign in with Google
   */
  public signInWithGoogle(): void {
    this.store.dispatch(AuthActions.login());
  }
}
