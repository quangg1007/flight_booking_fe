export interface BrandFlight {
  id: number;
  logoUrl: string;
  name: string;
}

export interface FlightLegInfo {
  timeDeparture: string;
  timeArrival: string;
  duration: string;
  stopCount: number;
  brandFlight: BrandFlight[];
  brandNameFlight: string;
  formatedDepDesCode: string;
}