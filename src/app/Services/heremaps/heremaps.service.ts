import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment.development';

declare var H: any;

@Injectable({
  providedIn: 'root',
})
export class HeremapsService {
  private platform: any;
  private map: any;
  private behavior: any;
  private ui: any;
  private searchService: any;
  private marker: any;
  private locationSelected = new Subject<any>();
  private mapReady = new BehaviorSubject<boolean>(false);

  constructor() {
    this.initHereMaps();
  }

  private initHereMaps() {
    this.platform = new H.service.Platform({
      apikey: environment.hereApiKey,
    });
    this.searchService = this.platform.getSearchService();
  }

  initMap(
    mapElement: ElementRef,
    lat: number = 30.0444,
    lng: number = 31.2357
  ) {
    if (!mapElement || !mapElement.nativeElement) {
      console.error('Map element not found');
      return;
    }

    const defaultLayers = this.platform.createDefaultLayers();
    this.map = new H.Map(
      mapElement.nativeElement,
      defaultLayers.vector.normal.map,
      {
        center: { lat, lng },
        zoom: 10,
      }
    );

    this.behavior = new H.mapevents.Behavior(
      new H.mapevents.MapEvents(this.map)
    );
    this.ui = H.ui.UI.createDefault(this.map, defaultLayers);

    this.map.addEventListener('tap', (evt: any) => {
      const coord = this.map.screenToGeo(
        evt.currentPointer.viewportX,
        evt.currentPointer.viewportY
      );
      this.placeMarker(coord);
      this.locationSelected.next(coord);
    });

    this.mapReady.next(true);
  }

  placeMarker(coordinate: any) {
    if (!this.map) {
      console.error('Map not initialized');
      return;
    }

    if (this.marker) {
      this.map.removeObject(this.marker);
    }
    this.marker = new H.map.Marker(coordinate);
    this.map.addObject(this.marker);

    this.map.setCenter(coordinate);

    this.map.setZoom(14);
  }

  getLocationSelected(): Observable<any> {
    return this.locationSelected.asObservable();
  }

  isMapReady(): Observable<boolean> {
    return this.mapReady.asObservable();
  }

  searchAddress(query: string): Observable<any> {
    return new Observable((observer) => {
      this.searchService.geocode(
        { q: query, lang: 'en' },
        (resultEn: any) => {
          if (resultEn.items && resultEn.items.length > 0) {
            this.searchService.geocode(
              { q: query, lang: 'ar' },
              (resultAr: any) => {
                if (resultAr.items && resultAr.items.length > 0) {
                  const combinedResult = {
                    en: resultEn.items[0],
                    ar: resultAr.items[0],
                  };
                  this.placeMarker(combinedResult.en.position);
                  observer.next(combinedResult);
                  observer.complete();
                } else {
                  observer.error('No Arabic results found');
                }
              },
              (error: any) => {
                observer.error(error);
              }
            );
          } else {
            observer.error('No English results found');
          }
        },
        (error: any) => {
          observer.error(error);
        }
      );
    });
  }
}
