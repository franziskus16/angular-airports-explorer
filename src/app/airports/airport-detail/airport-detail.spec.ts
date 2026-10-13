import { formatLocalTime } from './airport-detail';

describe('formatLocalTime', () => {
  // 12:00 UTC on a summer day.
  const noonUtc = new Date(Date.UTC(2026, 6, 1, 12, 0));

  it('shows the time in the airport time zone', () => {
    expect(formatLocalTime(noonUtc, 'Europe/Madrid')).toEqual({ time: '14:00', offset: 'GMT+2' });
    expect(formatLocalTime(noonUtc, 'America/New_York')).toEqual({
      time: '08:00',
      offset: 'GMT-4',
    });
  });
});
