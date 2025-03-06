import {
  Component,
  WritableSignal,
  Signal,
  computed,
  inject,
  signal,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CharacterXp } from '../../interface/character-xp.interface';
import { CharacterXpStateService } from '../../service/character-xp-state.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-character-calculator',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './character-calculator.component.html',
  styleUrl: './character-calculator.component.scss',
})
export class CharacterCalculatorComponent implements OnInit, OnDestroy {
  private characterStateService = inject(CharacterXpStateService);
  public currentCharacter: Signal<CharacterXp> = computed(
    () =>
      this.characterStateService.characterArray()[
        this.characterStateService.currentIndex()
      ]
  );
  public currentDate: WritableSignal<string | null> =
    this.characterStateService.deadlineDate;

  public environment = environment;
  private valid = true;
  private intervalRef: ReturnType<typeof setInterval>;

  public xpNeeded: WritableSignal<number> = signal(0);
  public xpLevel: WritableSignal<number> = signal(0);
  public frontLineDailyWins: Signal<number> = computed(() =>
    Math.ceil(
      this.xpNeeded() /
        (environment.frontLineWinExp + environment.frontLineDailyExp)
    )
  );
  public frontLineDailyLosses2: Signal<number> = computed(() =>
    Math.ceil(
      this.xpNeeded() /
        (environment.frontLineLoss2Exp + environment.frontLineDailyExp)
    )
  );
  public frontLineDailyLosses: Signal<number> = computed(() =>
    Math.ceil(
      this.xpNeeded() /
        (environment.frontLineLossExp + environment.frontLineDailyExp)
    )
  );
  public frontLineWins: Signal<number> = computed(() =>
    Math.ceil(this.xpNeeded() / environment.frontLineWinExp)
  );
  public frontLineLosses2: Signal<number> = computed(() =>
    Math.ceil(this.xpNeeded() / environment.frontLineLoss2Exp)
  );
  public frontLineLosses: Signal<number> = computed(() =>
    Math.ceil(this.xpNeeded() / environment.frontLineLossExp)
  );
  public crystallineWins: Signal<number> = computed(() =>
    Math.ceil(this.xpNeeded() / environment.crystallineWinExp)
  );
  public crystallineLosses: Signal<number> = computed(() =>
    Math.ceil(this.xpNeeded() / environment.crystallineLossExp)
  );
  public rivalWingsWins: Signal<number> = computed(() =>
    Math.ceil(this.xpNeeded() / environment.rivalWingsWinExp)
  );
  public rivalWingsLosses: Signal<number> = computed(() =>
    Math.ceil(this.xpNeeded() / environment.rivalWingsLossExp)
  );

  // Date Signal that is updated every hour. Used to calculate days remaining.
  public now: WritableSignal<Date> = signal(new Date());
  public daysRemaining: Signal<number | null> = computed(() => {
    const currentDate = this.currentDate();
    if (currentDate == null || currentDate === '') {
      return null;
    }
    const currentDateDate = this.dateFromStringAdjustedForReset(currentDate);
    const res = Math.ceil(
      (currentDateDate.valueOf() - this.now().valueOf()) / 86400000
    );
    return res > 0 ? res : null;
  });

  // These Signals are used to color the text of the Daily Frontline wins/losses based on if
  // you can make your goal level based on the date, using solely Daily Frontline Roulettes.
  public frontLineDailyWinsClass: Signal<string> = computed(() => {
    const daysRemaining = this.daysRemaining();
    if (daysRemaining == null) {
      return '';
    }
    if (daysRemaining >= this.frontLineDailyLosses()) {
      return 'daily-success';
    }
    if (daysRemaining >= this.frontLineDailyWins()) {
      return 'daily-warning';
    }
    return 'daily-fail';
  });
  public frontLineDailyLosses2Class: Signal<string> = computed(() => {
    const daysRemaining = this.daysRemaining();
    if (daysRemaining == null) {
      return '';
    }
    if (daysRemaining >= this.frontLineDailyLosses()) {
      return 'daily-success';
    }
    if (daysRemaining >= this.frontLineDailyLosses2()) {
      return 'daily-warning';
    }
    return 'daily-fail';
  });
  public frontLineDailyLossesClass: Signal<string> = computed(() => {
    const daysRemaining = this.daysRemaining();
    if (daysRemaining == null) {
      return '';
    }
    if (daysRemaining >= this.frontLineDailyLosses()) {
      return 'daily-success';
    }
    return 'daily-fail';
  });

  constructor() {
    toObservable(this.currentCharacter)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.recalculate();
      });
    // Every hour, update "now"
    // Need to pass in this.now as a parameter because in an Interval, "this" is the window.
    this.intervalRef = setInterval(this.interval, 3600000, this.now);
  }

  ngOnInit(): void {
    // If the inputted date is in the past, clear it, and save it.
    const currentDate = this.currentDate();
    if (
      currentDate != null &&
      this.dateFromStringAdjustedForReset(currentDate).valueOf() <
        this.now().valueOf()
    ) {
      this.currentDate.set(null);
      this.characterStateService.saveData();
    }
    // Initial Calculation
    this.recalculate();
    // Every hour, update "now"
    this.interval(this.now);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalRef);
  }

  // Need to pass in now as a parameter because in an Interval, "this" is the window.
  interval(now: WritableSignal<Date>): void {
    now.set(new Date());
  }

  updateCharacter(): void {
    this.characterStateService.saveData();
    this.recalculate();
  }

  recalculate(): void {
    const needed =
      environment.levelThresholds[this.currentCharacter().goalLevel] -
      environment.levelThresholds[this.currentCharacter().currentLevel] -
      this.currentCharacter().currentProgress;
    const level =
      environment.levelThresholds[this.currentCharacter().currentLevel + 1] -
      environment.levelThresholds[this.currentCharacter().currentLevel];
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
    while (
      this.currentCharacter().currentProgress >= this.xpLevel() &&
      this.valid
    ) {
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
      this.currentCharacter().goalLevel =
        environment.levelThresholds.length - 1;
    } else {
      this.currentCharacter().goalLevel = Math.floor(goal);
    }
    this.updateCharacter();
  }

  private expValuesForPlace: number[] = [
    0, // 0th place(holder)
    environment.frontLineWinExp, // 1st place
    environment.frontLineLoss2Exp, // 2nd place
    environment.frontLineLossExp, // 3rd place
  ];
  addFrontlineProgress(place: number, daily: boolean): void {
    // Don't do anything if it's an invalid place.
    if (this.expValuesForPlace[place] === undefined) {
      console.error('Invalid place: ' + place);
      return;
    }

    // Calculate the loss bonus factor.
    // The first 3rd place loss will have a factor of 1.0.
    // It will kick in at the second 3rd Place loss, and increase up to the maximum 1.5 at 6 losses.
    const lossBonusFactor: number =
      Math.min(
        5, // Maximum of 5
        Math.max(
          0, // Minimum of 0
          this.currentCharacter().cumulativeThirds
        )
      ) /
        10 +
      1;

    // Multiply the base experience by the loss bonus factor. (Round to prevent floating point errors)
    const expToAdd: number =
      Math.round(this.expValuesForPlace[place] * lossBonusFactor) +
      (daily ? environment.frontLineDailyExp : 0); // Add the daily bonus if it's daily roulette

    // If you won, reset the cumulativeThirds.
    // If you came in second, do nothing.
    // If you came in third, increment the cumulativeThirds.
    if (place === 1) {
      this.currentCharacter().cumulativeThirds = 0;
    } else if (place === 3) {
      this.currentCharacter().cumulativeThirds++;
    }

    // Add the experience as normal.
    this.addProgress(expToAdd);
  }

  addProgress(xpBoost: number): void {
    this.currentCharacter().currentProgress += xpBoost;
    this.correctCurrentProgress();
  }

  removeCurrentCharacter(): void {
    const charName =
      this.currentCharacter().name !== ''
        ? this.currentCharacter().name
        : 'the Current Character';
    if (confirm(`Are you sure you want to remove ${charName}?`)) {
      this.characterStateService.removeCurrentCharacter();
    }
  }
}
