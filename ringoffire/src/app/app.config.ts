import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { routes } from './app.routes';
import { importProvidersFrom } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'ring-of-fire-d46b8',
        appId: '1:883347938849:web:196f38ab13a428092f4d60',
        storageBucket: 'ring-of-fire-d46b8.firebasestorage.app',
        apiKey: 'AIzaSyBnSKkQKgAplblxpRapBlvCtIOmCjjuLQU',
        authDomain: 'ring-of-fire-d46b8.firebaseapp.com',
        messagingSenderId: '883347938849',
      })
    ),
    provideFirestore(() => getFirestore()),
  ],
};
