import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { weightsReducer } from './weights.reducers';
import { FEATURE_KEY } from './weights.selectors';
import { EffectsModule } from '@ngrx/effects';
import { WeightsEffects } from './weights.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(FEATURE_KEY, weightsReducer),
    EffectsModule.forFeature([WeightsEffects]),
  ],
})
export class WeightStoreModule {}
