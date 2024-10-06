import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../Services/user/user.service';
import { JWTService } from '../../Services/JWT/jwt.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { ChartsService } from '../../Services/chart/charts.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIconModule, RouterModule, CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  @ViewChild('earningsChart') chartCanvas!: ElementRef<HTMLCanvasElement>;

  userDetails: any;
  chart!: Chart;
  ownerId: string = '';

  constructor(
    private chartService: ChartsService,
    private userService: UserService,
    private jwtService: JWTService
  ) {}

  ngOnInit() {
    this.ownerId = this.jwtService.decodeToken(
      localStorage.getItem('token') || ''
    ).id;
    console.log('Owner ID used for fetching data:', this.ownerId);
    this.fetchUserDetails();
    this.fetchChartData();
  }

  fetchUserDetails() {
    this.userService.getUserDetails(this.ownerId).subscribe(
      (data) => {
        this.userDetails = data;
        console.log('User Details:', this.userDetails);
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );
  }

  fetchChartData() {
    this.chartService.getEarningsData(this.ownerId).subscribe(
      (data: any) => {
        console.log('Received chart data:', data);
        if (this.chart) {
          this.chart.destroy();
        }
        this.chart = this.chartService.createChart(
          this.chartCanvas.nativeElement,
          data
        );
      },
      (error: any) => {
        console.error('Error fetching chart data:', error);
      }
    );
  }
}
