export interface SpacecraftAttributes {
  name: string;
  mission: string;
  active: boolean;
  mass: number;
  objectClass: string;
  shape: string;
  firstEpoch: string;
  [key: string]: any;
}

export interface Spacecraft {
  id: number;
  attributes: SpacecraftAttributes;
}
