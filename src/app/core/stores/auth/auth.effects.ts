import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { AuthService } from '@app/core/services/auth.service';
import { from, switchMap, tap } from 'rxjs';
import { mapResponse } from '@ngrx/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '@app/core/services/user.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  /**
   * Login effect
   */
  public login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(() =>
        from(this.authService.onGoogleSignIn()).pipe(
          mapResponse({
            next: () => AuthActions.loginSuccess(),
            error: (error: HttpErrorResponse) =>
              AuthActions.loginFailure({ error }),
          })
        )
      )
    );
  });

  /**
   * Logout effect
   */
  public logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() =>
        from(this.authService.onSignOut()).pipe(
          mapResponse({
            next: () => AuthActions.logoutSuccess(),
            error: (error: HttpErrorResponse) =>
              AuthActions.logoutFailure({ error }),
          })
        )
      )
    );
  });

  /**
   * Get user profile effect
   */
  public getUserProfile$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.getUserProfile),
      switchMap(() =>
        this.userService.getUserProfile().pipe(
          mapResponse({
            next: (user) => AuthActions.getUserProfileSuccess({ user }),
            error: (error: HttpErrorResponse) =>
              AuthActions.getUserProfileFailure({ error }),
          })
        )
      )
    );
  });

  /**
   * Load users by IDs effect
   */
  public loadUsersByIds$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loadUsersByIds),
      switchMap(({ userIds }) =>
        this.userService.getUsersByIds(userIds).pipe(
          mapResponse({
            next: (users) => AuthActions.loadUsersByIdsSuccess({ users }),
            error: (error: HttpErrorResponse) =>
              AuthActions.loadUsersByIdsFailure({ error }),
          })
        )
      )
    );
  });

  /**
   * Save user profile effect
   */
  public saveUserProfile$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.saveUserProfile),
      switchMap(({ user }) =>
        this.userService.saveUserProfile(user).pipe(
          mapResponse({
            next: (user) => AuthActions.saveUserProfileSuccess({ user }),
            error: (error: HttpErrorResponse) =>
              AuthActions.saveUserProfileFailure({ error }),
          })
        )
      )
    );
  });

  /**
   * Save User Profile Success effect - Show success message and navigate
   */
  public saveUserProfileSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.saveUserProfileSuccess),
        tap(() => {
          this.snackBar.open('Profile created successfully!', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/home']);
        })
      );
    },
    { dispatch: false }
  );

  /**
   * Save User Profile Failure effect - Show error message
   */
  public saveUserProfileFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.saveUserProfileFailure),
        tap(({ error }) => {
          this.snackBar.open(error.error.message, 'Close', {
            duration: 5000,
            panelClass: 'error-snackbar',
          });
        })
      );
    },
    { dispatch: false }
  );

  /**
   * Get User Profile Failure effect
   */
  public getUserProfileFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.getUserProfileFailure),
        tap(() => this.router.navigate(['auth', 'signup']))
      );
    },
    { dispatch: false }
  );

  /**
   * Save user profile weight effect
   */
  public saveUserProfileWeight$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.saveUserProfileWeight),
      switchMap(({ weight }) =>
        this.userService.saveUserProfileWeight(weight).pipe(
          mapResponse({
            next: (weight) =>
              AuthActions.saveUserProfileWeightSuccess({ weight }),
            error: (error: HttpErrorResponse) =>
              AuthActions.saveUserProfileWeightFailure({ error }),
          })
        )
      )
    );
  });
}
