import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AmenitiesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  postAmenitiesByHotelId(hotelId: string, amenities: any): Observable<any> {
    console.log('Sending amenities:', JSON.stringify(amenities, null, 2));
    return this.http
      .post(`${this.apiUrl}/amenities/hotel/${hotelId}`, amenities)
      .pipe(
        tap((response) => {
          console.log('Received response:', JSON.stringify(response, null, 2));
          console.log(
            'Added fields:',
            this.findAddedFields(amenities, response)
          );
        }),
        catchError(this.handleError)
      );
  }

  private findAddedFields(sent: any, received: any): object {
    const addedFields: { [key: string]: any } = {};
    for (const key in received) {
      if (!(key in sent)) {
        addedFields[key] = received[key];
      }
    }
    return addedFields;
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(
      () => new Error('An error occurred; please try again later.')
    );
  }
}
