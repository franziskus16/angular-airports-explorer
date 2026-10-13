/** Airport as returned by the list endpoint. */
export interface AirportSummary {
  /** IATA code, e.g. "BCN". */
  code: string;
  name: string;
  city: string;
  country: string;
}

/** Full airport record returned by the detail endpoint. */
export interface Airport extends AirportSummary {
  /** ICAO code, e.g. "LEBL". */
  icao: string;
  operator: string;
  /** IANA time zone, e.g. "Europe/Madrid". */
  timeZone: string;
  latitude: number;
  longitude: number;
}
