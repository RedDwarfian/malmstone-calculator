import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterCalculatorComponent } from './character-calculator.component';

describe('CharacterCalculatorComponent', () => {
  let component: CharacterCalculatorComponent;
  let fixture: ComponentFixture<CharacterCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterCalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
