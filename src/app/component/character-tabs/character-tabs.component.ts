import { Component, WritableSignal, inject } from '@angular/core';
import { CharacterXpStateService } from '../../service/character-xp-state.service';

@Component({
  selector: 'app-character-tabs',
  standalone: true,
  imports: [],
  templateUrl: './character-tabs.component.html',
  styleUrl: './character-tabs.component.scss'
})
export class CharacterTabsComponent {
  private characterStateService = inject(CharacterXpStateService);
  public characterList = this.characterStateService.characterArray;
  public currentIndex: WritableSignal<number> = this.characterStateService.currentIndex;

  newCharacter(): void {
    this.characterStateService.addCharacter();
    this.currentIndex.set(this.characterList().length - 1);
  }
  changeIndex(index: number): void {
    this.currentIndex.set(index);
  }
}
