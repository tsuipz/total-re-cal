import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { NotificationsActions } from '../notifications';
import * as WeightsActions from '../weights/weights.actions';
import { AuthService } from '@app/core/services/auth.service';
import { from, switchMap, tap, of } from 'rxjs';
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
   * Complete signup effect - Save user profile and initial weight check-in
   */
  public completeSignup$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.completeSignup),
      switchMap(({ user, initialWeight }) =>
        this.userService.saveUserProfile(user).pipe(
          mapResponse({
            next: (savedUser) =>
              AuthActions.completeSignupSuccess({
                user: savedUser,
                initialWeight,
              }),
            error: (error: HttpErrorResponse) =>
              AuthActions.completeSignupFailure({ error }),
          })
        )
      )
    );
  });

  /**
   * Complete signup success effect - Show success message and navigate
   */
  public completeSignupSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.completeSignupSuccess),
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
   * Save initial weight after signup success
   */
  public saveInitialWeight$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.completeSignupSuccess),
      switchMap(({ initialWeight }) =>
        of(WeightsActions.addWeightCheckIn({ weight: initialWeight }))
      )
    );
  });

  /**
   * Reload user profile after initial weight is saved
   */
  public reloadUserProfileAfterSignup$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.completeSignupSuccess),
      switchMap(() => of(AuthActions.getUserProfile()))
    );
  });

  /**
   * Complete signup failure effect - Show error message
   */
  public completeSignupFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.completeSignupFailure),
        tap(({ error }) => {
          this.snackBar.open(
            error.error?.message || 'Failed to create profile',
            'Close',
            {
              duration: 5000,
              panelClass: 'error-snackbar',
            }
          );
        })
      );
    },
    { dispatch: false }
  );

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
   * Check for check-in reminder after user profile is loaded
   */
  public checkForCheckInReminder$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.getUserProfileSuccess),
      switchMap(({ user }) =>
        of(NotificationsActions.checkForCheckInReminder({ userId: user.uid }))
      )
    );
  });

  // Note: Initial weight check-in will be handled differently
  // We can either:
  // 1. Store the initial weight temporarily during signup
  // 2. Create a separate action for initial weight check-in
  // 3. Handle it in the signup component directly
}
