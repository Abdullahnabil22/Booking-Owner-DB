import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

import { JWTService } from '../JWT/jwt.service';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private apiUrl = `${environment.apiUrl}/messages`;

  constructor(private http: HttpClient, private jwtService: JWTService) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  private getOwnerId(): string {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtService.decodeToken(token);
      return decodedToken.id;
    }
    throw new Error('No token found');
  }

  getMessages(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/${this.getOwnerId()}`, {
        headers: this.getHeaders(),
      })
      .pipe(map((messages) => this.processMessages(messages)));
  }

  private processMessages(messages: any[]): any[] {
    const groupedMessages: { [key: string]: any } = {};
    messages.forEach((message) => {
      let groupKey: string;
      let groupInfo: any;
      if (message.hostId) {
        groupKey = message.hostId._id || 'unknown';
        groupInfo = {
          type: 'Hotel',
          id: groupKey,
          name: message.hostId.name || 'Unknown Host',
          sender: message.sender.userName,
          receiver: message.receiver.userName,
        };
      } else if (message.apartmentId) {
        groupKey = message.apartmentId._id || 'unknown';
        groupInfo = {
          type: 'Apartment',
          id: groupKey,
          name: message.apartmentId.name?.en || 'Unknown Apartment',
          sender: message.sender.userName,
          receiver: message.receiver.userName,
        };
      } else {
        groupKey = 'unknown';
        groupInfo = {
          type: 'unknown',
          id: 'unknown',
          name: 'Unknown',
        };
      }
      console.log(groupInfo);

      if (!groupedMessages[groupKey]) {
        groupedMessages[groupKey] = {
          ...groupInfo,
          messages: [],
        };
      }

      groupedMessages[groupKey].messages.push({
        id: message._id,
        sender: message.sender,
        receiver: message.receiver,
        content: message.content,
        timestamp: message.timestamp,
        read: message.read,
      });
    });

    return Object.values(groupedMessages);
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
