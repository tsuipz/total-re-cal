import { UnitSystem } from '@app/core/models/types';

export const convertWeightToKg = (weight: number, unitSystem: UnitSystem) => {
  if (unitSystem === 'imperial') {
    return weight / 2.20462;
  }

  return weight;
};
