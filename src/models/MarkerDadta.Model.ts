export interface MarketData {
    id?: string;
    lat: number;
    lng: number;
    time: number;
    nextId?: string;
  }

export interface Marker {
  data: MarketData;
  object: any;
}