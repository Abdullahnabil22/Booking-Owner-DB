import { Injectable } from '@angular/core';

declare global {
  interface Window {
    google: any;
  }
}

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsService {
  private isLoaded = false;

  constructor() {}

  loadGoogleMaps(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isLoaded) {
        console.log('Google Maps API already loaded');
        resolve();
        return;
      }

      if (!window['google']) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyChFD6FophQdBICHsxJiBbDluPj6PjnHDM&libraries=places`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        script.onload = () => {
          console.log('Google Maps API loaded successfully');
          this.isLoaded = true;
          resolve();
        };
        script.onerror = (error) => {
          console.error('Error loading Google Maps API:', error);
          reject(error);
        };
      } else {
        console.log('Google Maps API already present in window object');
        this.isLoaded = true;
        resolve();
      }
    });
  }

  initAutocomplete(inputElement: HTMLInputElement, callback: Function): void {
    if (!this.isLoaded) {
      console.error('Google Maps API not loaded. Call loadGoogleMaps() first.');
      return;
    }

    console.log('Initializing autocomplete for:', inputElement);

    const autocomplete = new window['google'].maps.places.Autocomplete(
      inputElement,
      {
        types: ['geocode'],
      }
    );

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      console.log('Place selected:', place);
      if (place.geometry) {
        callback(place);
      } else {
        console.warn('No details available for place:', place.name);
      }
    });

    console.log('Autocomplete initialized');
  }
}
