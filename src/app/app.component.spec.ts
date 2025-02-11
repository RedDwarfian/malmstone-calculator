import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CharacterXpStateService } from './service/character-xp-state.service';
import { environment } from '../environments/environment';

describe('AppComponent', () => {
  let mockCharacterXpStateService: jasmine.SpyObj<CharacterXpStateService>;

  beforeEach(async () => {
    mockCharacterXpStateService = jasmine.createSpyObj(
      'CharacterXpStateService',
      ['characterArray', 'currentIndex', 'deadlineDate', 'loaded']
    );
    mockCharacterXpStateService.characterArray.and.returnValue([
      structuredClone(environment.newCharacterDefaults),
    ]);
    mockCharacterXpStateService.currentIndex.and.returnValue(0);
    mockCharacterXpStateService.deadlineDate.and.returnValue(null);
    mockCharacterXpStateService.loaded.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: CharacterXpStateService,
          useValue: mockCharacterXpStateService,
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have the current year', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.currentYear).toBe(new Date().getFullYear());
  });

  it('should render loading message when not loaded', () => {
    mockCharacterXpStateService.loaded.and.returnValue(false);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p')?.textContent).toContain('LOADING...');
  });

  it('should render character tabs and calculator when loaded', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-character-tabs')).toBeTruthy();
    expect(compiled.querySelector('app-character-calculator')).toBeTruthy();
  });

  it('should render footer with correct text', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const footer = compiled.querySelector('footer');
    expect(footer).toBeTruthy();
    expect(footer?.textContent).toContain('Created by RedDwarfian');
    expect(footer?.textContent).toContain(
      `© 2024-${new Date().getFullYear()}`
    );
  });

  it('should have links in the footer', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('footer a');
    expect(links.length).toBe(2);
  });
});
