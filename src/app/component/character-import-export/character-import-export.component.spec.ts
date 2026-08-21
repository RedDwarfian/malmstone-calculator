import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterImportExportComponent } from './character-import-export.component';

describe('CharacterImportExportComponent', () => {
  let component: CharacterImportExportComponent;
  let fixture: ComponentFixture<CharacterImportExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterImportExportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterImportExportComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
