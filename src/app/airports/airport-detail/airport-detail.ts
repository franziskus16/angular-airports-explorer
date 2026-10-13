import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { StatusMessage } from '../../shared/status-message/status-message';
import { Airport } from '../airport.model';
import { AirportsService } from '../airports.service';

/** Formats the current time in an airport's time zone, e.g. { time: "14:05", offset: "GMT+2" }. */
export function formatLocalTime(date: Date, timeZone: string): { time: string; offset: string } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'shortOffset',
  }).formatToParts(date);
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';
  return { time: `${pick('hour')}:${pick('minute')}`, offset: pick('timeZoneName') };
}

@Component({
  selector: 'app-airport-detail',
  imports: [RouterLink, StatusMessage],
  templateUrl: './airport-detail.html',
  styleUrl: './airport-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AirportDetail {
  private readonly airportsService = inject(AirportsService);

  /** Bound from the `:code` route parameter. */
  readonly code = input.required<string>();

  protected readonly airport = rxResource({
    params: () => this.code(),
    stream: ({ params: code }) => this.airportsService.getByCode(code),
  });

  private readonly now = signal(new Date());

  protected readonly localTime = computed(() => {
    const airport = this.airport.hasValue() ? this.airport.value() : undefined;
    return airport ? formatLocalTime(this.now(), airport.timeZone) : null;
  });

  constructor() {
    const timer = setInterval(() => this.now.set(new Date()), 30_000);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));

    const title = inject(Title);
    effect(() => {
      const airport = this.airport.hasValue() ? this.airport.value() : undefined;
      title.setTitle(
        airport ? `${airport.code} · ${airport.city} · Airports Explorer` : 'Airports Explorer',
      );
    });
  }

  protected mapUrl(airport: Airport): string {
    const { latitude: lat, longitude: lon } = airport;
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=13/${lat}/${lon}`;
  }

  protected formatCoordinate(value: number, positive: string, negative: string): string {
    return `${Math.abs(value).toFixed(3)}° ${value >= 0 ? positive : negative}`;
  }
}
