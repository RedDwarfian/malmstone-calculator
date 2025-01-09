import { environmentInterface } from '../app/interface/environment.interface';

export const environment: environmentInterface = {
  localStorageKey: 'FFXIV_PvP_Character_Data',
  localStorageDateKey: 'FFXIV_PvP_Character_Date',
  estimatedPatchCadence: 11491200000, // 19 weeks in seconds
  levelThresholds: [
    0, 0, 2000, 4000, 6000, 8000, 11000, 14000, 17000, 20000, 23000, 27000,
    31000, 35000, 39000, 43000, 48500, 54000, 59500, 65000, 70500, 78000, 85500,
    93000, 100500, 108000, 118000, 128000, 138000, 148000, 158000, 178000,
    198000, 218000, 238000, 258000, 278000, 298000, 318000, 338000, 358000,
  ],
  frontLineWinExp: 1500,
  frontLineLoss2Exp: 1250,
  frontLineLossExp: 1000,
  frontLineDailyWinExp: 3000,
  frontLineDailyLoss2Exp: 2750,
  frontLineDailyLossExp: 2500,
  crystallineWinExp: 900,
  crystallineLossExp: 700,
  rivalWingsWinExp: 1250,
  rivalWingsLossExp: 750,
  newCharacterDefaults: {
    name: '',
    server: '',
    currentLevel: 1,
    currentProgress: 0,
    goalLevel: 25,
  },
  regions: [
    {
      name: 'North American DC',
      dataCenters: [
        {
          name: 'Aether',
          servers: [
            'Adamantoise',
            'Cactuar',
            'Faerie',
            'Gilgamesh',
            'Jenova',
            'Midgardsormr',
            'Sargatanas',
            'Siren',
          ],
        },
        {
          name: 'Crystal',
          servers: [
            'Balmung',
            'Brynhildr',
            'Coeurl',
            'Diabolos',
            'Goblin',
            'Malboro',
            'Mateus',
            'Zalera',
          ],
        },
        {
          name: 'Dynamis',
          servers: [
            'Cuchulainn',
            'Golem',
            'Halicarnassus',
            'Kraken',
            'Maduin',
            'Marilith',
            'Rafflesia',
            'Seraph',
          ],
        },
        {
          name: 'Primal',
          servers: [
            'Behemoth',
            'Excalibur',
            'Exodus',
            'Famfrit',
            'Hyperion',
            'Lamia',
            'Leviathan',
            'Ultros',
          ],
        },
      ],
    },
    {
      name: 'European DC',
      dataCenters: [
        {
          name: 'Chaos',
          servers: [
            'Cerberus',
            'Louisoix',
            'Moogle',
            'Omega',
            'Phantom',
            'Ragnarok',
            'Sagittarius',
            'Spriggan',
          ],
        },
        {
          name: 'Light',
          servers: [
            'Alpha',
            'Lich',
            'Odin',
            'Phoenix',
            'Raiden',
            'Shiva',
            'Twintania',
            'Zodiark',
          ],
        },
      ],
    },
    {
      name: 'Oceanian DC',
      dataCenters: [
        {
          name: 'Materia',
          servers: ['Bismarck', 'Ravana', 'Sephirot', 'Sophia', 'Zurvan'],
        },
      ],
    },
    {
      name: 'Japanese DC',
      dataCenters: [
        {
          name: 'Elemental',
          servers: [
            'Aegis',
            'Atomos',
            'Carbuncle',
            'Garuda',
            'Gungnir',
            'Kujata',
            'Tonberry',
            'Typhon',
          ],
        },
        {
          name: 'Gaia',
          servers: [
            'Alexander',
            'Bahamut',
            'Durandal',
            'Fenrir',
            'Ifrit',
            'Ridill',
            'Tiamat',
            'Ultima',
          ],
        },
        {
          name: 'Mana',
          servers: [
            'Anima',
            'Asura',
            'Chocobo',
            'Hades',
            'Ixion',
            'Masamune',
            'Pandaemonium',
            'Titan',
          ],
        },
        {
          name: 'Meteor',
          servers: [
            'Belias',
            'Mandragora',
            'Ramuh',
            'Shinryu',
            'Unicorn',
            'Valefor',
            'Yojimbo',
            'Zeromus',
          ],
        },
      ],
    },
  ],
};
