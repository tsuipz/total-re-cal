import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { AuthEffects } from './core/stores/auth/auth.effects';
import { authReducer } from './core/stores/auth/auth.reducers';
import { MealsEffects } from './core/stores/meals/meals.effects';
import { mealsReducer } from './core/stores/meals/meals.reducers';
import { WorkoutsEffects } from './core/stores/workouts/workouts.effects';
import { workoutsReducer } from './core/stores/workouts/workouts.reducers';
import { WeightsEffects } from './core/stores/weights/weights.effects';
import { weightsReducer } from './core/stores/weights/weights.reducers';
import { NotificationsEffects } from './core/stores/notifications/notifications.effects';
import { notificationsReducer } from './core/stores/notifications/notifications.reducer';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

const REDUCERS = {
  auth: authReducer,
  meals: mealsReducer,
  workouts: workoutsReducer,
  weights: weightsReducer,
  notifications: notificationsReducer,
  router: routerReducer,
};

const EFFECTS = [
  AuthEffects,
  MealsEffects,
  WorkoutsEffects,
  WeightsEffects,
  NotificationsEffects,
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStore(REDUCERS),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideEffects(EFFECTS),
    provideRouterStore(),
    provideNativeDateAdapter(),
    provideAnimations(),
    provideCharts(withDefaultRegisterables()),
  ],
};
