import { UnitSystem } from '@app/core/models/types';

export const convertHeightToCm = (height: number, unitSystem: UnitSystem) => {
  if (unitSystem === 'imperial') {
    return height * 2.54;
  }

  return height;
};
