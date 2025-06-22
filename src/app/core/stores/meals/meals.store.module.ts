import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { mealsReducer } from './meals.reducers';
import { FEATURE_KEY } from './meals.selectors';
import { EffectsModule } from '@ngrx/effects';
import { MealsEffects } from './meals.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(FEATURE_KEY, mealsReducer),
    EffectsModule.forFeature([MealsEffects]),
  ],
})
export class MealsStoreModule {}
