import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../Services/user/user.service';
import { JWTService } from '../../Services/JWT/jwt.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIconModule, RouterModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  userDetails: any;
  constructor(
    private userService: UserService,
    private jwtService: JWTService
  ) {}
  ngOnInit() {
    this.userService
      .getUserDetails(
        this.jwtService.decodeToken(localStorage.getItem('token') || '').id
      )
      .subscribe((data) => {
        this.userDetails = data;
        console.log(this.userDetails);
      });
  }
}
