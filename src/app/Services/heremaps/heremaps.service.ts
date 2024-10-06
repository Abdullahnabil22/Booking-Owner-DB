import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

declare var H: any;

@Injectable({
  providedIn: 'root',
})
export class HeremapsService {
  private platform: any;
  private searchService: any;

  constructor() {
    this.initHereMaps();
  }

  private initHereMaps() {
    this.platform = new H.service.Platform({
      apikey: environment.hereApiKey,
    });
    this.searchService = this.platform.getSearchService();
  }

  searchAddress(query: string): Observable<any> {
    return new Observable((observer) => {
      // First, search in English
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
