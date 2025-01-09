import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { CharacterXp } from '../interface/character-xp.interface';
import { LocalDataService } from './local-data.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CharacterXpStateService {
  public characterArray: WritableSignal<CharacterXp[]> = signal([] as CharacterXp[]);
  public deadlineDate: WritableSignal<string|null> = signal(null);
  public loaded: WritableSignal<boolean> = signal(false);
  public currentIndex: WritableSignal<number> = signal(0);
  private localDataService = inject(LocalDataService);
  private localDataKey = environment.localStorageKey;
  private localDataDateKey = environment.localStorageDateKey;

  constructor() {
    // TODO: Load from localDataService
    // This is default if there is no entry in the localDataService.
    this.characterArray.set(this.localDataService.getData(this.localDataKey) ??
      [structuredClone(environment.newCharacterDefaults)]);
    this.deadlineDate.set(this.localDataService.getData(this.localDataDateKey) ?? null);
    this.loaded.set(true);
  }

  addCharacter(): void {
    this.characterArray().push(structuredClone(environment.newCharacterDefaults));
    this.saveData();
  }

  saveData(): void {
    this.localDataService.saveData(this.localDataKey, this.characterArray());
    this.localDataService.saveData(this.localDataDateKey, this.deadlineDate());
  }

  removeCurrentCharacter() {
    // If the array is of length 1, reset the array.
    if (this.characterArray().length === 1) {
      this.characterArray.set([structuredClone(environment.newCharacterDefaults)]);
    } else {
      // Slice and splice the currentIndex out of the array.
      this.characterArray.set(this.characterArray().slice());
      this.characterArray().splice(this.currentIndex(), 1);
      // If we just removed the last entry, decrement it.
      if (this.currentIndex() >= this.characterArray().length) {
        this.currentIndex.set(this.characterArray().length - 1);
      }
    }
    this.saveData();
  }
}
