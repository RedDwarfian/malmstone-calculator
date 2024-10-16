import { Component, WritableSignal, Signal, computed, inject, signal } from '@angular/core';
import { CharacterXp } from '../../interface/character-xp.interface';
import { CharacterXpStateService } from '../../service/character-xp-state.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-character-calculator',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './character-calculator.component.html',
  styleUrl: './character-calculator.component.scss'
})
export class CharacterCalculatorComponent {
  private characterStateService = inject(CharacterXpStateService);
  public currentCharacter: Signal<CharacterXp> = computed(() =>
    this.characterStateService.characterArray()[this.characterStateService.currentIndex()]);
  
  public environment = environment;
  private valid = true;

  public xpNeeded: WritableSignal<number> = signal(0);
  public xpLevel: WritableSignal<number> = signal(0);
  public frontLineDailyWins: Signal<number> = computed(() => Math.ceil(this.xpNeeded() / environment.frontLineDailyWinExp));
  public frontLineDailyLosses2: Signal<number> = computed(() => Math.ceil(this.xpNeeded() / environment.frontLineDailyLoss2Exp));
  public frontLineDailyLosses: Signal<number> = computed(() => Math.ceil(this.xpNeeded() / environment.frontLineDailyLossExp));
  public frontLineWins: Signal<number> = computed(() => Math.ceil(this.xpNeeded() / environment.frontLineWinExp));
  public frontLineLosses2: Signal<number> = computed(() => Math.ceil(this.xpNeeded() / environment.frontLineLoss2Exp));
  public frontLineLosses: Signal<number> = computed(() => Math.ceil(this.xpNeeded() / environment.frontLineLossExp));
  public crystallineWins: Signal<number> = computed(() => Math.ceil(this.xpNeeded() / environment.crystallineWinExp));
  public crystallineLosses: Signal<number> = computed(() => Math.ceil(this.xpNeeded() / environment.crystallineLossExp));
  public rivalWingsWins: Signal<number> = computed(() => Math.ceil(this.xpNeeded() / environment.rivalWingsWinExp));
  public rivalWingsLosses: Signal<number> = computed(() => Math.ceil(this.xpNeeded() / environment.rivalWingsLossExp));

  constructor() {
    toObservable(this.currentCharacter)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.recalculate();
      });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.recalculate();
  }

  updateCharacter(): void {
    this.characterStateService.saveData();
    this.recalculate();
  }
  
  recalculate(): void {
    const needed = environment.levelThresholds[this.currentCharacter().goalLevel] - environment.levelThresholds[this.currentCharacter().currentLevel] - this.currentCharacter().currentProgress;
    const level = environment.levelThresholds[this.currentCharacter().currentLevel + 1] - environment.levelThresholds[this.currentCharacter().currentLevel];
    this.valid = !isNaN(needed) && !isNaN(level);

    if (this.valid) {
      this.xpNeeded.set(needed);
      this.xpLevel.set(level);
    }
  }

  correctCurrentLevel(): void {
    const level = this.currentCharacter().currentLevel;
    if (level < 1) {
      this.currentCharacter().currentLevel = 1;
    } else if (level > this.currentCharacter().goalLevel) {
      this.currentCharacter().currentLevel = this.currentCharacter().goalLevel;
    } else {
      this.currentCharacter().currentLevel = Math.floor(level);
    }
    this.updateCharacter();
  }

  correctCurrentProgress(): void {
    const progress = this.currentCharacter().currentProgress;
    if (progress < 0) {
      this.currentCharacter().currentProgress = 0;
    } else {
      this.currentCharacter().currentProgress = Math.floor(progress);
    }
    while (this.currentCharacter().currentProgress >= this.xpLevel() && this.valid) {
      this.currentCharacter().currentLevel++;
      this.currentCharacter().currentProgress -= this.xpLevel();
      this.recalculate();
    }
    this.updateCharacter();
  }

  correctGoalLevel(): void {
    const goal = this.currentCharacter().goalLevel;
    if (goal < this.currentCharacter().currentLevel) {
      this.currentCharacter().goalLevel = this.currentCharacter().currentLevel;
    } else if (goal >= environment.levelThresholds.length) {
      this.currentCharacter().goalLevel = environment.levelThresholds.length - 1;
    } else {
      this.currentCharacter().goalLevel = Math.floor(goal);
    }
    this.updateCharacter();
  }

  addProgress(xpBoost: number): void {
    this.currentCharacter().currentProgress += xpBoost;
    this.correctCurrentProgress();
  }

  removeCurrentCharacter(): void {
    const charName = this.currentCharacter().name !== "" ? this.currentCharacter().name : "the Current Character";
    if (confirm(`Are you sure you want to remove ${charName}?`)) {
      this.characterStateService.removeCurrentCharacter();
    }
  }
}
