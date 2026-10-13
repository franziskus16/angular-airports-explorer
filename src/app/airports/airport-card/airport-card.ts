import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AirportSummary } from '../airport.model';

/** Boarding-pass style card. The whole card is one link to the airport's detail page. */
@Component({
  selector: 'app-airport-card',
  imports: [RouterLink],
  templateUrl: './airport-card.html',
  styleUrl: './airport-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AirportCard {
  readonly airport = input.required<AirportSummary>();
}
