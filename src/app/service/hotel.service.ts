import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  constructor(private httpClient: HttpClient) {}

  getHotelsByOwnerId(): Observable<any[]> { // Using any instead of Hotel
    return this.httpClient.get<any[]>('http://localhost:3000/host'); // Correct endpoint
  }
}
