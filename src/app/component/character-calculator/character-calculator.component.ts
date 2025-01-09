import { Component, WritableSignal, Signal, computed, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CharacterXp } from '../../interface/character-xp.interface';
import { CharacterXpStateService } from '../../service/character-xp-state.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-character-calculator',
    imports: [FormsModule, ReactiveFormsModule],
    templateUrl: './character-calculator.component.html',
    styleUrl: './character-calculator.component.scss'
})
export class CharacterCalculatorComponent implements OnInit, OnDestroy {
  private characterStateService = inject(CharacterXpStateService);
  public currentCharacter: Signal<CharacterXp> = computed(() =>
    this.characterStateService.characterArray()[this.characterStateService.currentIndex()]);
  public currentDate: WritableSignal<string|null> = this.characterStateService.deadlineDate;
  
  public environment = environment;
  private valid = true;
  private intervalRef: NodeJS.Timeout;

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
  public now: WritableSignal<Date> = signal(new Date());
  public daysRemaining: Signal<number|null> = computed(() => {
    const currentDate = this.currentDate();
    if (currentDate == null || currentDate === "") { return null; }
    const currentDateDate = this.dateFromStringAdjustedForReset(currentDate);
    const res = Math.ceil((currentDateDate.valueOf() - this.now().valueOf())/86400000);
    return res > 0 ? res : null;
  });
  public frontLineDailyWinsClass: Signal<string> = computed(() => {
    const daysRemaining = this.daysRemaining();
    if (daysRemaining == null) { return ""; }
    if (daysRemaining >= this.frontLineDailyLosses()) { return "daily-success"; }
    if (daysRemaining >= this.frontLineDailyWins()) { return "daily-warning"; }
    return "daily-fail";
  });
  public frontLineDailyLosses2Class: Signal<string> = computed(() => {
    const daysRemaining = this.daysRemaining();
    if (daysRemaining == null) { return ""; }
    if (daysRemaining >= this.frontLineDailyLosses()) { return "daily-success"; }
    if (daysRemaining >= this.frontLineDailyLosses2()) { return "daily-warning"; }
    return "daily-fail";
  });
  public frontLineDailyLossesClass: Signal<string> = computed(() => {
    const daysRemaining = this.daysRemaining();
    if (daysRemaining == null) { return ""; }
    if (daysRemaining >= this.frontLineDailyLosses()) { return "daily-success"; }
    return "daily-fail";
  });

  constructor() {
    toObservable(this.currentCharacter)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.recalculate();
      });
    this.intervalRef = setInterval(this.interval, 3600000);
  }

  ngOnInit(): void {
    // If the inputted date is in the past, clear it, and save it.
    const currentDate = this.currentDate();
    if (currentDate != null && this.dateFromStringAdjustedForReset(currentDate).valueOf() < this.now().valueOf()) {
      this.currentDate.set(null);
      this.characterStateService.saveData();
    }
    // Initial Calculation
    this.recalculate();
    // Every hour, update "now"
    this.interval();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalRef);
  }

  interval(): void {
    this.now.set(new Date());
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
      this.xpNeeded.set(Math.max(needed, 0));
      this.xpLevel.set(Math.max(level, 0));
    }
  }

  // Takes an input string, assumed to be a string in yyyy-MM-dd format,
  // turns it into a date (assumed to be UTC), then it to coincide with
  // that date's FFXIV reset time.
  // Reset occurs at 15:00 UTC.
  dateFromStringAdjustedForReset(currentDate: string): Date {
    const resultDate = new Date(currentDate);
    resultDate.setHours(resultDate.getHours() + 15);
    return resultDate;
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
