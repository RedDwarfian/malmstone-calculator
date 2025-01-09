import { CharacterXp } from "./character-xp.interface";

export interface environmentInterface {
  localStorageKey: string,
  localStorageDateKey: string,
  estimatedPatchCadence: number
  levelThresholds: number[];
  frontLineWinExp: number;
  frontLineLoss2Exp: number;
  frontLineLossExp: number;
  frontLineDailyWinExp: number;
  frontLineDailyLoss2Exp: number;
  frontLineDailyLossExp: number;
  crystallineWinExp: number;
  crystallineLossExp: number;
  rivalWingsWinExp: number;
  rivalWingsLossExp: number;
  newCharacterDefaults: CharacterXp;
  regions: Region[];
}

export interface Region {
  name: string;
  dataCenters: DataCenter[];
}

export interface DataCenter {
  name: string;
  servers: string[];
}