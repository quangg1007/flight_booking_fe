export interface Airlines {
  id: string;
  name: string;
  price: string;
}

export interface Airport {
  id: string;
  name: string;
  price: string;
}

export interface Stop {
  id: string;
  name: string;
  price: string;
}

interface FlightTimeDuration {
  minTime: Date;
  maxTime: Date;
  duration: number;
}

interface Price {
  minPrice: number;
  maxPrice: number;
}
