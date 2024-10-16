import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CharacterXpStateService } from './service/character-xp-state.service';
import { CharacterCalculatorComponent } from './component/character-calculator/character-calculator.component';
import { CharacterTabsComponent } from './component/character-tabs/character-tabs.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CharacterCalculatorComponent, CharacterTabsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private characterStateService = inject(CharacterXpStateService);
  public loaded = this.characterStateService.loaded;
}
