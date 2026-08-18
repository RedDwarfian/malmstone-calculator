import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NgxGoogleAnalyticsModule } from 'ngx-google-analytics';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(NgxGoogleAnalyticsModule.forRoot('G-FR7W221WM7')),
  ],
};
