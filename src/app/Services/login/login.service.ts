import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = environment.apiUrl;
  userLog: BehaviorSubject<boolean>;

  constructor(private http: HttpClient) {
    this.userLog = new BehaviorSubject<boolean>(this.isUserLoggedIn);
    this.userLog.next(this.isUserLoggedIn);
  }

  // دالة تسجيل الدخول باستخدام الرمز
  loginWithToken(token: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post(`${this.apiUrl}/user/loginWithToken`, { token }, httpOptions);
  }

  // دالة تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور
  login(email: string, password: string): Observable<{ token: string }> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'text' as 'json',
    };

    return this.http
      .post(`${this.apiUrl}/user/login`, { email, password }, httpOptions)
      .pipe(map((response) => ({ token: response as string })));
  }

  get isUserLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  getUserStatus() {
    return this.userLog.asObservable(); // تصحيح هنا
  }

  logout() {
    localStorage.removeItem('token');
    this.userLog.next(false);
  }
}