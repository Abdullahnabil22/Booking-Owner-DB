import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PayoutServiceService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  requestPayout(data: {
    owner_id: string;
    amount: number;
    paypalEmail: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/payoutRequest/request`, data);
  }
}
