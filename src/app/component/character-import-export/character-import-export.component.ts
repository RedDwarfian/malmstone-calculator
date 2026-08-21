import { Component, inject } from '@angular/core';
import { NGX_TIPPY_CONFIG, NgxTippyModule } from 'ngx-tippy-wrapper';
import { ImportExportData } from '../../interface/import-export-data.interface';
import { CharacterXpStateService } from '../../service/character-xp-state.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-character-import-export',
  imports: [NgxTippyModule],
  templateUrl: './character-import-export.component.html',
  styleUrl: './character-import-export.component.scss',
  providers: [{ provide: NGX_TIPPY_CONFIG, useValue: environment.tippyProps }],
})
export class CharacterImportExportComponent {
  private characterStateService = inject(CharacterXpStateService);

  importData(): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json,application/json';
    fileInput.onchange = async () => {
      try {
        const file = fileInput.files?.[0];
        if (!file) {
          return;
        }

        const importedData: unknown = JSON.parse(await file.text());
        if (!this.characterStateService.validateData(importedData)) {
          window.alert('The inputted file was invalid.');
          return;
        }

        if (
          !window.confirm('Replace the existing data with the uploaded data?')
        ) {
          return;
        }

        const data = importedData as ImportExportData;
        this.characterStateService.characterArray.set(data.characterArray);
        this.characterStateService.deadlineDate.set(data.deadlineDate);
        this.characterStateService.saveData();
      } catch {
        window.alert('The inputted file was invalid.');
      } finally {
        fileInput.onchange = null;
        fileInput.remove();
      }
    };
    try {
      fileInput.click();
    } catch (error) {
      fileInput.onchange = null;
      fileInput.remove();
      throw error;
    }
  }

  exportData(): void {
    const exportData: ImportExportData = {
      characterArray: this.characterStateService.characterArray(),
      deadlineDate: this.characterStateService.deadlineDate(),
    };
    const jsonData = JSON.stringify(exportData);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const downloadUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    const isoDate = new Date().toISOString();

    downloadLink.href = downloadUrl;
    downloadLink.download = `malmstones_export_${isoDate}.json`;
    try {
      downloadLink.click();
    } finally {
      downloadLink.remove();
      URL.revokeObjectURL(downloadUrl);
    }
  }
}
