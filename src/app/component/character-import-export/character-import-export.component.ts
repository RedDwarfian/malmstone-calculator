import { Component, inject } from '@angular/core';
import { TooltipDirective } from 'ngx-smart-tooltip';
import { CharacterXpStateService } from '../../service/character-xp-state.service';

@Component({
  selector: 'app-character-import-export',
  imports: [TooltipDirective],
  templateUrl: './character-import-export.component.html',
  styleUrl: './character-import-export.component.scss',
})
export class CharacterImportExportComponent {
  private characterStateService = inject(CharacterXpStateService);

  importData(): void {
    // Implement your import logic here
    console.log('Importing data...');
  }

  exportData(): void {
    // Implement your export logic here
    console.log('Exporting data...');
  }
}
