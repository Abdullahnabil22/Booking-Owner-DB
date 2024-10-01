import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorService } from '../error/error.service';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private errorHandler: ErrorService) {}

  getUserDetails(id: string) {
    return this.http
      .get(`${this.apiUrl}/user/${id}`)
      .pipe(catchError(this.errorHandler.handleError));
  }
}
