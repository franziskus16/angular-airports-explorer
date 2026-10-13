import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { StatusMessage } from '../../shared/status-message/status-message';
import { AirportCard } from '../airport-card/airport-card';
import { AirportSummary } from '../airport.model';
import { AirportsService } from '../airports.service';

/** Case- and accent-insensitive match on code, name, city or country. */
export function filterAirports(airports: AirportSummary[], query: string): AirportSummary[] {
  const normalize = (value: string) =>
    value
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase();
  const needle = normalize(query.trim());
  if (!needle) {
    return airports;
  }
  return airports.filter((airport) =>
    [airport.code, airport.name, airport.city, airport.country].some((field) =>
      normalize(field).includes(needle),
    ),
  );
}

@Component({
  selector: 'app-airports-list',
  imports: [AirportCard, StatusMessage],
  templateUrl: './airports-list.html',
  styleUrl: './airports-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AirportsList {
  private readonly airportsService = inject(AirportsService);

  protected readonly airports = rxResource({
    stream: () => this.airportsService.getAll(),
  });

  protected readonly query = signal('');

  protected readonly visibleAirports = computed(() =>
    filterAirports(this.airports.hasValue() ? this.airports.value() : [], this.query()),
  );

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
