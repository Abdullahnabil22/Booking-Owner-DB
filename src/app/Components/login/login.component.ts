import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../Services/login/login.service';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { JWTService } from '../../Services/JWT/jwt.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, HttpClientModule, CommonModule],
  providers: [LoginService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isUserLoggedIn: boolean = false;
  constructor(
    private loginService: LoginService,
    private router: Router,
    private jwtService: JWTService
  ) {}

  ngOnInit(): void {
    this.isUserLoggedIn = this.loginService.isUserLoggedIn;
  }

  login(): void {
    this.loginService.login(this.email, this.password).subscribe(
      (response) => {
        if (response && response.token) {
          const decodedToken = this.jwtService.decodeToken(response.token);
          if (decodedToken.role === 'owner') {
            localStorage.setItem('token', response.token);
            this.router.navigate(['/dashboard']);
            this.isUserLoggedIn = true;
          } else {
            this.errorMessage = 'Access denied. You are not authorized.';
            console.log('Invalid response structure:', response);
          }
        }
      },
      (error) => {
        this.errorMessage = 'Access denied.';
      }
    );
  }
}
