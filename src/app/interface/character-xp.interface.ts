export interface CharacterXp {
  name: string;
  server: string;
  currentLevel: number;
  currentProgress: number;
  goalLevel: number;
  cumulativeThirds: number; // Cumulative Third-Place Losses since last win in Frontline
}
