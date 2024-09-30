import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../Services/login/login.service';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

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
  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.isUserLoggedIn = this.loginService.isUserLoggedIn;
  }

  login(): void {
    this.loginService.login(this.email, this.password).subscribe(
      (response) => {
        console.log('Response received:', response);
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/dashboard']);
          this.isUserLoggedIn = true;
        } else {
          this.errorMessage = 'Invalid login response';
          console.log('Invalid response structure:', response);
        }
      },
      (error) => {
        this.errorMessage = 'Login failed. Please try again.';
        console.error('Login error:', error);
      }
    );
  }
}
