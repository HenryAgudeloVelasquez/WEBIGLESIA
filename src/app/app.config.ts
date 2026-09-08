import {
  ApplicationConfig,
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withViewTransitions,
} from '@angular/router';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { PRIME_NG_CONFIG, PrimeNG, PrimeNGConfigType } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

import { routes } from './app.routes';

// Preset exclusivo de la Iglesia: Grace Navy & Gold (Basado en el logo oficial)
const GraceNavyGoldPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#fdfbf2',
      100: '#fbf5df',
      200: '#f6e9bc',
      300: '#f0d990',
      400: '#e7c35a',
      500: '#d4af37', // Imperial Gold 500
      600: '#bc9528',
      700: '#96711e',
      800: '#79591e',
      900: '#64491c',
      950: '#39270c'
    }
  }
});

function provideCustomPrimeNG(...features: PrimeNGConfigType[]): EnvironmentProviders {
  const providers = features?.map((feature) => ({
    provide: PRIME_NG_CONFIG,
    useValue: feature,
    multi: false,
  }));

  const initializer = provideAppInitializer(() => {
    const primeNGConfig = inject(PrimeNG);
    features?.forEach((feature) => primeNGConfig.setConfig(feature));
    primeNGConfig._setVerified(true);
  });

  return makeEnvironmentProviders([...(providers || []), initializer]);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    provideCustomPrimeNG({
      theme: {
        preset: GraceNavyGoldPreset,
        options: {
          darkModeSelector: '.app-dark',
          cssLayer: {
            name: 'primeng',
            order: 'primeng-base, primeng, primeng-utilities',
          },
        },
      },
      ripple: true,
    }),
  ],
};
