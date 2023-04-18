import {
  PERIOD_MOTHS,
  PERIOD_QUARTER,
  PERIOD_YEAR,
  quarterStartMonths,
} from './constants';

export function selectPeriod(startMonth: number, endMonth: number): string {
  if (startMonth === 0 && endMonth === 11) {
    return PERIOD_YEAR;
  }
  if (quarterStartMonths.includes(startMonth) && endMonth - startMonth === 2) {
    return PERIOD_QUARTER;
  }
  return PERIOD_MOTHS;
}
