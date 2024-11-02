import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { JWTService } from '../JWT/jwt.service';
import { environment } from '../../../environments/environment.development';

import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { Hotel } from '../../model/hotel';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private jwtService: JWTService) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  private getOwnerId(): string {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtService.decodeToken(token);
      return decodedToken.id;
    }
    throw new Error('No token found');
  }

  getUserHotels(userId: string): Observable<any> {
    console.log('Fetching hotels for user:', userId);
    const hamada = this.http.get(`${this.apiUrl}/host/owner/${userId}`, {
      headers: new HttpHeaders({
        Authorization: ` ${localStorage.getItem('token')}`,
      }),
    });
    console.log('hamada hotel', hamada);
    return hamada;
  }
  //////////////// getHotelById
  // getHotelById(hotelId: string): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/host/${hotelId}`, {
  //     headers: new HttpHeaders({
  //       Authorization: `Bearer ${localStorage.getItem('token')}`
  //     })
  //   });
  // }

  /////////////////////// delethotelbyid
  // deleteHotelById(hotelId: string): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/host/${hotelId}`, {
  //     headers: new HttpHeaders({
  //       Authorization: `Bearer ${localStorage.getItem('token')}`,
  //     }),
  //   });
  // }
  // disableHotelById(hotelId: string): Observable<void> {
  //   return this.http.patch<void>(`${this.apiUrl}/host/${hotelId}/disable`, { isDisabled: true });
  // }
  disableHotelById(hotelId: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/host/disable/${hotelId}`, { isDisabled: true }).pipe(
      tap(response => console.log('Disable response:', response)) 
    );
  }
  
  /////////////////////////// update

  updateHotel(updatedHotel: Hotel): Observable<Hotel> {
    return this.http.patch<Hotel>(
      `${this.apiUrl}/host/${updatedHotel._id}`,
      updatedHotel,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
      }
    );
  }

  // Service for getting a hotel by ID
  getHotelById(hotelId: string): Observable<any> {
    console.log('hamadaid', hotelId);
    const resulat = this.http.get(`${this.apiUrl}/host/${hotelId}`);
    console.log('result', resulat);
    return resulat;
  }

  getVisitors(hotelId: string): Observable<any[]> {
    const url = `${this.apiUrl}/earnings/${hotelId}`;
    console.log('Fetching visitors from:', url);
    return this.http.get<any[]>(url).pipe(
      tap((data) => console.log('Fetched visitors:', data)),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    throw error;
  }

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('image', file, file.name);

    return this.http
      .post<any>(`${this.apiUrl}/cloudinary/upload`, formData, {
        headers: this.getHeaders(),
      })
      .pipe(map((response) => response.secure_url));
  }

  createHotel(hotelData: any, files: File[]): Observable<any> {
    const ownerId = this.getOwnerId();
    const uploadObservables = files.map((file) => this.uploadImage(file));
    return forkJoin(uploadObservables).pipe(
      switchMap((imageUrls: string[]) => {
        hotelData.images = imageUrls;
        return this.http.post(`${this.apiUrl}/host/${ownerId}`, hotelData, {
          headers: this.getHeaders(),
        });
      })
    );
  }
}
