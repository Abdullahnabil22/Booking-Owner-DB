import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class JWTService {
  constructor() {}

  decodeToken(token: string): any {
    return jwtDecode(token);
  }
}
