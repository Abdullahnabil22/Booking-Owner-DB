import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorService } from '../error/error.service';
import { catchError } from 'rxjs';
import { environment } from '../../../environments/environment.development';

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
}
