import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { JWTService } from '../JWT/jwt.service';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ApartmentService {
  private apiUrl = environment.apiUrl;

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
  
  getUserAppartment(userId: string): Observable<any> {
    console.log('Fetching hotels for user:', userId);
    const hamada = this.http.get(`${this.apiUrl}/apartments/owner/${userId}`, {
  

      headers: new HttpHeaders({
        Authorization: ` ${localStorage.getItem('token')}`,
      }),
    });
    console.log('hamada appartment', hamada);
    return hamada;
  }
  // deleteAppartmentlById(apartmentId: string): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/apartments/${apartmentId}`, {
  //     headers: new HttpHeaders({
  //       Authorization: `Bearer ${localStorage.getItem('token')}`,
  //     }),
  //   });
  // }
  updateDepartmentById(apartmentId:string): Observable<any>{
    return this.http.put(`${this.apiUrl}/apartments/${apartmentId}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
        });
  }
  getAppartmentById(apartmentId:string): Observable<any>{
    return this.http.get(`${this.apiUrl}/apartments/${apartmentId}`)
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
