import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { weightReducer } from './weight.reducers';
import { FEATURE_KEY } from './weight.selectors';
import { EffectsModule } from '@ngrx/effects';
import { WeightEffects } from './weight.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(FEATURE_KEY, weightReducer),
    EffectsModule.forFeature([WeightEffects]),
  ],
})
export class WeightStoreModule {}
