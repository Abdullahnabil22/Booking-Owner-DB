import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createRoomTypeByHotelId(hotelId: string, roomType: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/rooms/hotel/${hotelId}`, roomType, {
      headers,
    });
  }
}
