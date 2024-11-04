import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../Services/login/login.service';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { JWTService } from '../../Services/JWT/jwt.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, HttpClientModule, CommonModule],
  providers: [LoginService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isUserLoggedIn: boolean = false;
  showPassword = false;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private jwtService: JWTService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isUserLoggedIn = this.loginService.isUserLoggedIn;

    this.activatedRoute.queryParams.subscribe((params) => {
      const token = params['token'];
      console.log('Token from URL:', token);
      if (token) {
        localStorage.setItem('token', token);

        this.loginService.loginWithToken(token).subscribe(
          (response) => {
            if (response && response.user) {
              const decodedToken = this.jwtService.decodeToken(token);
              if (decodedToken.role === 'owner') {
                this.router.navigate(['/dashboard']);
                this.isUserLoggedIn = true;
                this.loginService.userLog.next(true);
              } else {
                this.errorMessage = 'Access denied. You are not authorized.';
                console.log('Invalid response structure:', response);
              }
            }
          },
          (error) => {
            this.errorMessage = 'Access denied.';
            console.error('Error during login with token:', error);
          }
        );
      }
    });
  }

  login(): void {
    this.loginService.login(this.email, this.password).subscribe(
      (response) => {
        if (response && response.token) {
          try {
            const decodedToken = this.jwtService.decodeToken(response.token);
            if (decodedToken.role === 'owner') {
              localStorage.setItem('token', response.token);
              this.router.navigate(['/dashboard']);
              this.isUserLoggedIn = true;
              this.loginService.userLog.next(true);
            } else {
              this.errorMessage = 'Access denied. You are not authorized.';
              console.log('Invalid response structure:', response);
            }
          } catch (error) {
            this.errorMessage = 'Invalid authentication please try again.';
            console.error('Token decode error:', error);
          }
        }
      },
      (error) => {
        this.errorMessage = 'Access denied.';
        console.error('Login error:', error);
      }
    );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
