export type Direction = 'N' | 'S' | 'E' | 'W';
export type Command = 'f' | 'b' | 'l' | 'r';

export interface Rover {
  id: string;
  x: number;
  y: number;
  direction: Direction;
  color: string;
}

export interface RoverResponse {
  id: string;
  x: number;
  y: number;
  direction: Direction;
  _links?: {
    self: { href: string };
    rover: { href: string };
  };
}
