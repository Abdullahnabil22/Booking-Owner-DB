import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  constructor(private http: HttpClient) {}

  addHotel(hotel: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/hotels', hotel);
  }
}
