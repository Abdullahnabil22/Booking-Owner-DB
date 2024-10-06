import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor(private router: Router) {}
  handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    if (error.status === 401) {
      console.error('Authentication error. Token may be invalid or expired.');
      this.router.navigate(['/login']);
    }
    return throwError(
      () => new Error('Something went wrong. Please try again later.')
    );
  }
}
