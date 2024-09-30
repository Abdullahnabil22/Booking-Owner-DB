import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JWTService } from '../JWT/jwt.service';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private apiUrl = 'http://localhost:3000/messages';
  private user_id: string | null = null;
  constructor(private http: HttpClient, private jwtService: JWTService) {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtService.decodeToken(token);
      this.user_id = decodedToken.user_id;
    }
  }

  getAllUserMessages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${this.user_id}`);
  }

  sendMessage(messageData: any): Observable<any> {
    return this.http.post(this.apiUrl, messageData);
  }

  updateMessageStatus(messageId: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${messageId}`, { status });
  }

  deleteMessage(messageId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${messageId}`);
  }
}
