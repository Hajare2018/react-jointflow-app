import '@testing-library/jest-dom/vitest';
import { vi, expect, describe, it, afterEach, beforeEach } from 'vitest';
import { getCurrentQuarter, getQuarter, getQuarterStart, getQuarterEnd } from './Utils';

describe('Utils', () => {
  describe('getCurrentQuarter', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it.for([
      ['2024-11-02T12:22:00.000Z', 1, 4],
      ['2024-11-02T12:22:00.000Z', 12, 4],
      ['2024-11-02T12:22:00.000Z', 3, 3],
      ['2024-11-02T12:22:00.000Z', 7, 2],
      ['2024-08-02T12:22:00.000Z', 5, 1],
      ['2024-12-02T12:22:00.000Z', 7, 2],
    ])('quarter for %s with year end month %i is %i', ([date, yearEndMonth, quarter]) => {
      vi.setSystemTime(new Date(date));

      expect(getQuarter(new Date(), yearEndMonth)).toEqual(quarter);
    });

    it.for([
      ['2024-11-02T12:22:00.000Z', 1, '2024-11-01T00:00:00.000Z'],
      ['2025-01-02T12:22:00.000Z', 1, '2024-11-01T00:00:00.000Z'],
      ['2024-11-02T12:22:00.000Z', 12, '2024-10-01T00:00:00.000Z'],
      ['2024-11-02T12:22:00.000Z', 3, '2024-10-01T00:00:00.000Z'],
      ['2024-11-02T12:22:00.000Z', 7, '2024-11-01T00:00:00.000Z'],
      ['2024-08-02T12:22:00.000Z', 5, '2024-06-01T00:00:00.000Z'],
      ['2025-01-02T12:22:00.000Z', 5, '2024-12-01T00:00:00.000Z'],
      ['2024-12-02T12:22:00.000Z', 7, '2024-11-01T00:00:00.000Z'],
    ])('quarter start for %s with year end month %i is %s', ([date, yearEndMonth, quarter]) => {
      vi.setSystemTime(new Date(date));

      expect(getQuarterStart(new Date(), yearEndMonth)).toEqual(new Date(quarter));
    });

    it.for([
      ['2024-11-02T12:22:00.000Z', 1, '2025-01-31T23:59:59.999Z'],
      ['2024-11-02T12:22:00.000Z', 12, '2024-12-31T23:59:59.999Z'],
      ['2024-11-02T12:22:00.000Z', 3, '2024-12-31T23:59:59.999Z'],
      ['2024-11-02T12:22:00.000Z', 7, '2025-01-31T23:59:59.999Z'],
      ['2024-08-02T12:22:00.000Z', 5, '2024-08-31T23:59:59.999Z'],
      ['2024-12-02T12:22:00.000Z', 5, '2025-02-28T23:59:59.999Z'],
      ['2024-12-02T12:22:00.000Z', 7, '2025-01-31T23:59:59.999Z'],
    ])('quarter end for %s with year end month %i is %s', ([date, yearEndMonth, quarter]) => {
      vi.setSystemTime(new Date(date));

      expect(getQuarterEnd(new Date(), yearEndMonth)).toEqual(new Date(quarter));
    });

    it.for([
      [
        '2024-11-02T12:22:00.000Z',
        1,
        '2024-11-01T00:00:00.000Z',
        '2025-01-31T23:59:59.999Z',
        2024,
        4,
      ],
      [
        '2024-11-02T12:22:00.000Z',
        12,
        '2024-10-01T00:00:00.000Z',
        '2024-12-31T23:59:59.999Z',
        2024,
        4,
      ],
    ])(
      'returns the correct start and end date for the quarter when yearEndMonth is %i',
      ([systemTime, yearEndMonth, startDate, endDate, year, quarter]) => {
        const currentDate = new Date(systemTime);
        vi.setSystemTime(currentDate);
        const result = getCurrentQuarter(yearEndMonth);

        expect(result).toEqual({
          start_date: new Date(startDate),
          end_date: new Date(endDate),
          year,
          quarter,
        });
      },
    );
  });
});
