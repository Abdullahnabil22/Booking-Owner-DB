import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { LocalStorageService } from '../localstorage/localstorage.service';
import { JWTService } from '../JWT/jwt.service';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private userId: string = '';
  private apiUrl = `${environment.apiUrl}/messages/${this.userId}`;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private jwtService: JWTService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.localStorageService.getItem('token');
    if (token) {
      this.userId = this.jwtService.decodeToken(token).userId;
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getMessages(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  sendMessage(message: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, message, {
      headers: this.getHeaders(),
    });
  }

  markAsRead(messageId: string): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/${messageId}/read`,
      {},
      { headers: this.getHeaders() }
    );
  }
}
