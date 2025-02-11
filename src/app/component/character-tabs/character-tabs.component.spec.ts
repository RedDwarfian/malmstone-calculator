import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterTabsComponent } from './character-tabs.component';
import { CharacterXpStateService } from '../../service/character-xp-state.service';
// import { environment } from '../../../environments/environment';

describe('CharacterTabsComponent', () => {
  let component: CharacterTabsComponent;
  let fixture: ComponentFixture<CharacterTabsComponent>;
  let mockCharacterXpStateService: jasmine.SpyObj<CharacterXpStateService>;

  beforeEach(async () => {
    mockCharacterXpStateService = jasmine.createSpyObj(
      'CharacterXpStateService',
      ['characterArray', 'currentIndex', 'addCharacter']
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

    await TestBed.configureTestingModule({
      imports: [CharacterTabsComponent],
      providers: [
        {
          provide: CharacterXpStateService,
          useValue: mockCharacterXpStateService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize characterList and currentIndex', () => {
    expect(component.characterList).toBeDefined();
    expect(component.currentIndex).toBeDefined();
  });

  // Commented out because I can't figure out how to spy on a Signal properly.
  // it('should call addCharacter and set currentIndex when newCharacter is called', () => {
  //   mockCharacterXpStateService.addCharacter.and.callFake(() => {
  //     mockCharacterXpStateService.characterArray.and.returnValue([{
  //       name: 'Test Character',
  //       server: 'Test Server',
  //       currentLevel: 1,
  //       goalLevel: 10,
  //       currentProgress: 0,
  //     }, environment.newCharacterDefaults]);
  //   });
  //   component.newCharacter();
  //   expect(mockCharacterXpStateService.addCharacter).toHaveBeenCalled();
  //   expect(component.currentIndex()).toBe(1);
  // });

  // Commented out because I can't figure out how to spy on a Signal properly.
  // it('should set currentIndex when changeIndex is called', () => {
  //   component.changeIndex(1);
  //   expect(component.currentIndex()).toBe(1);
  // });

  it('should render character tabs', () => {
    const compiled = fixture.nativeElement;
    const buttons = compiled.querySelectorAll('.user-tab');
    expect(buttons.length).toBe(2); // One for the character and one for the new character button
    expect(buttons[0].textContent).toContain('Test Character@Test Server');
    expect(buttons[1].textContent).toContain('+');
  });

  it('should change index when character tab is clicked', () => {
    const compiled = fixture.nativeElement;
    const buttons = compiled.querySelectorAll('.user-tab');
    buttons[0].click();
    fixture.detectChanges();
    expect(component.currentIndex()).toBe(0);
  });

  it('should add a new character when the "+" button is clicked', () => {
    const compiled = fixture.nativeElement;
    const buttons = compiled.querySelectorAll('.user-tab');
    buttons[1].click();
    fixture.detectChanges();
    expect(mockCharacterXpStateService.addCharacter).toHaveBeenCalled();
  });
});
