import { Injectable } from '@angular/core';
import { JWTService } from '../JWT/jwt.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OwnerService {
  private apiUrl = environment.apiUrl;
  constructor(private jwtService: JWTService, private http: HttpClient) {}
  private getOwnerId(): string {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtService.decodeToken(token);
      return decodedToken.id;
    }
    throw new Error('No token found');
  }

  getOwnerBalance(ownerId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/ownerBalance/${ownerId}`);
  }
}
