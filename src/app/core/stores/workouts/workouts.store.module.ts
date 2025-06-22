import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { workoutsReducer } from './workouts.reducers';
import { FEATURE_KEY } from './workouts.selectors';
import { EffectsModule } from '@ngrx/effects';
import { WorkoutsEffects } from './workouts.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(FEATURE_KEY, workoutsReducer),
    EffectsModule.forFeature([WorkoutsEffects]),
  ],
})
export class WorkoutsStoreModule {}
