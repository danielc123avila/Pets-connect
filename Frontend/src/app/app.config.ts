import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { InterceptorService } from './interceptor/interceptorservice.service';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide:HTTP_INTERCEPTORS,
      useClass:InterceptorService,
      multi:true

    },
    provideRouter(routes), 
    provideHttpClient()] // Para usear Http client en registro
};
