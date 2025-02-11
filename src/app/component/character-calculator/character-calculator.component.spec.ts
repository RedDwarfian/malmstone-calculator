import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CharacterCalculatorComponent } from './character-calculator.component';
import { CharacterXpStateService } from '../../service/character-xp-state.service';
import { environment } from '../../../environments/environment';

describe('CharacterCalculatorComponent', () => {
  let component: CharacterCalculatorComponent;
  let fixture: ComponentFixture<CharacterCalculatorComponent>;
  let mockCharacterXpStateService: jasmine.SpyObj<CharacterXpStateService>;

  beforeEach(async () => {
    mockCharacterXpStateService = jasmine.createSpyObj(
      'CharacterXpStateService',
      [
        'characterArray',
        'currentIndex',
        'deadlineDate',
        'saveData',
        'removeCurrentCharacter',
      ]
    );

    mockCharacterXpStateService.characterArray.and.returnValue([
      {
        name: 'Test Character',
        server: 'Test Server',
        currentLevel: 1,
        goalLevel: 10,
        currentProgress: 0,
      },
    ]);
    mockCharacterXpStateService.currentIndex.and.returnValue(0);
    // mockCharacterXpStateService.deadlineDate = jasmine.createSpyObj('WritableSignal', ['set', 'get']);
    mockCharacterXpStateService.deadlineDate.and.returnValue(null);

    await TestBed.configureTestingModule({
      imports: [CharacterCalculatorComponent, FormsModule, ReactiveFormsModule],
      providers: [
        {
          provide: CharacterXpStateService,
          useValue: mockCharacterXpStateService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update character name', () => {
    const input = fixture.debugElement.query(
      By.css('input[name="charName"]')
    ).nativeElement;
    input.value = 'New Character Name';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.currentCharacter().name).toBe('New Character Name');
  });

  it('should update character server', () => {
    const select = fixture.debugElement.query(
      By.css('select[name="server"]')
    ).nativeElement;
    select.value = select.options[1].value;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.currentCharacter().server).toBe(select.options[1].value);
  });

  it('should update current level', () => {
    const input = fixture.debugElement.query(
      By.css('input[name="currentLevel"]')
    ).nativeElement;
    input.value = '5';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.currentCharacter().currentLevel).toBe(5);
  });

  it('should update current progress', () => {
    const input = fixture.debugElement.query(
      By.css('input[name="currentProgress"]')
    ).nativeElement;
    input.value = '100';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.currentCharacter().currentProgress).toBe(100);
  });

  it('should update goal level', () => {
    const input = fixture.debugElement.query(
      By.css('input[name="goalLevel"]')
    ).nativeElement;
    input.value = '15';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.currentCharacter().goalLevel).toBe(15);
  });

  // Commented out because I can't figure out how to spy on a Signal.
  // it('should update goal deadline', () => {
  //   // const setterSpy = spyOn(component.currentDate, 'set');
  //   const input = fixture.debugElement.query(By.css('input[name="goalDate"]')).nativeElement;
  //   input.value = '2023-12-31';
  //   input.dispatchEvent(new Event('input'));
  //   fixture.detectChanges();
  //   expect(setterSpy).toHaveBeenCalledOnceWith('2023-12-31');
  // });

  it('should call removeCurrentCharacter on button click', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const button = fixture.debugElement.query(
      By.css('button.remove_button')
    ).nativeElement;
    button.click();
    fixture.detectChanges();
    expect(
      mockCharacterXpStateService.removeCurrentCharacter
    ).toHaveBeenCalled();
  });

  it('should recalculate XP needed and level', () => {
    component.currentCharacter().currentLevel = 1;
    component.currentCharacter().goalLevel = 10;
    component.currentCharacter().currentProgress = 0;
    component.recalculate();
    fixture.detectChanges();
    expect(component.xpNeeded()).toBe(
      environment.levelThresholds[10] - environment.levelThresholds[1]
    );
    expect(component.xpLevel()).toBe(
      environment.levelThresholds[2] - environment.levelThresholds[1]
    );
  });

  it('should add progress and correct current progress', () => {
    component.currentCharacter().currentProgress = 0;
    component.addProgress(100);
    fixture.detectChanges();
    expect(component.currentCharacter().currentProgress).toBe(100);
  });

  // TODO: Check if now.set() was called, or check if the interval was triggered.
  // it('should update "now" every hour', () => {
  //   jasmine.clock().install();
  //   const initialNow = component.now();
  //   jasmine.clock().tick(3600000);
  //   expect(component.now()).not.toBe(initialNow);
  //   jasmine.clock().uninstall();
  // });

  // Commented out because I can't figure out how to spy on a Signal.
  // it('should calculate days remaining correctly', () => {
  //   component.currentDate.set('2023-12-31');
  //   fixture.detectChanges();
  //   const daysRemaining = component.daysRemaining();
  //   expect(daysRemaining).toBeGreaterThan(0);
  // });

  // Commented out because I can't figure out how to spy on a Signal.
  // it('should calculate frontLineDailyWinsClass correctly', () => {
  //   component.currentDate.set('2023-12-31');
  //   fixture.detectChanges();
  //   const className = component.frontLineDailyWinsClass();
  //   expect(className).toBe('daily-success');
  // });
});
