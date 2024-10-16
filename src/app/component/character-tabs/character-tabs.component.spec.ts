import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterTabsComponent } from './character-tabs.component';

describe('CharacterTabsComponent', () => {
  let component: CharacterTabsComponent;
  let fixture: ComponentFixture<CharacterTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
