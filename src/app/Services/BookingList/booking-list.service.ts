import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingListService {

  constructor(private http: HttpClient) {}
apiUrl="http://localhost:3000/bookings"
  getBookingsByHostId(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/host/${id}`);
  }


}
