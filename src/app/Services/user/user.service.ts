import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorService } from '../error/error.service';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../model/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private errorHandler: ErrorService) {}

  getUserDetails(id: string) {
    return this.http
      .get(`${this.apiUrl}/user/${id}`)
      .pipe(catchError(this.errorHandler.handleError));
  }
  getUserById(userId: string): Observable<User> {
    const name = this.http.get<any>(
      `http://localhost:3000/reviews/user/${userId}`
    );
    console.log('name', name);
    return name;
  }
}
