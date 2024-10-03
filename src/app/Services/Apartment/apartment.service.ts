import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { JWTService } from '../JWT/jwt.service';

@Injectable({
  providedIn: 'root',
})
export class ApartmentService {
  private apiUrl = 'http://localhost:3000';

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

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('image', file, file.name);

    return this.http
      .post<any>(`${this.apiUrl}/cloudinary/upload`, formData, {
        headers: this.getHeaders(),
      })
      .pipe(map((response) => response.secure_url));
  }

  createApartment(apartmentData: any, files: File[]): Observable<any> {
    const ownerId = this.getOwnerId();
    const uploadObservables = files.map((file) => this.uploadImage(file));
    return forkJoin(uploadObservables).pipe(
      switchMap((imageUrls: string[]) => {
        apartmentData.images = imageUrls;
        return this.http.post(
          `${this.apiUrl}/apartments/${ownerId}`,
          apartmentData,
          {
            headers: this.getHeaders(),
          }
        );
      })
    );
  }
}
