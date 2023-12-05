export interface Coordinate {
  x?: number;
  y?: number;
};

export interface Car {
  start?: Coordinate;
  end?: Coordinate;
  isEmergency?: boolean;
}

export type Row = string[];

export type Matrix = Row[];

export type Steps = Matrix[];
