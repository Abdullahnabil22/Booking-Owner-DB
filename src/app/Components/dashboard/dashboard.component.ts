import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../Services/user/user.service';
import { JWTService } from '../../Services/JWT/jwt.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsService } from '../../Services/chart/charts.service';
import { OwnerService } from '../../Services/owner/owner.service';
import { PayoutServiceService } from '../../Services/payoutService/payout-service.service';
import { SocketService } from '../../Services/socket.service/socket.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatIconModule,
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  @ViewChild('earningsChart')
  earningsChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('membersChart') membersChartCanvas!: ElementRef<HTMLCanvasElement>;

  userDetails: any;
  earningsChart!: Chart;
  ownerId: string = '';
  membersChart!: Chart;
  totalFunds: number = 0;
  currentBalance: number = 0;
  showPayoutForm = false;
  paypalEmail = '';
  payoutNotification: {
    message: string;
    type: 'success' | 'warning' | 'danger';
  } | null = null;
  constructor(
    private chartService: ChartsService,
    private userService: UserService,
    private jwtService: JWTService,
    private ownerService: OwnerService,
    private payoutService: PayoutServiceService,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    this.ownerId = this.jwtService.decodeToken(
      localStorage.getItem('token') || ''
    ).id;
    console.log('Owner ID used for fetching data:', this.ownerId);
    this.fetchUserDetails();
    this.fetchChartData();
    this.ownerService.getOwnerBalance(this.ownerId).subscribe((data) => {
      if (data) {
        console.log(data);
        this.currentBalance = Math.round(data?.current_balance);
        this.totalFunds = Math.round(data?.total_earned);
      } else {
        this.currentBalance = 0;
      }
    });

    this.socketService.payoutStatus$.subscribe((data) => {
      this.payoutNotification = {
        message: data.message,
        type:
          data.status === 'PAID'
            ? 'success'
            : data.status === 'PENDING'
            ? 'warning'
            : 'danger',
      };

      setTimeout(() => {
        this.payoutNotification = null;
      }, 5000);
    });
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
        if (this.earningsChart) {
          this.earningsChart.destroy();
        }
        if (this.membersChart) {
          this.membersChart.destroy();
        }
        this.earningsChart = this.chartService.createChart(
          this.earningsChartCanvas.nativeElement,
          data
        );
        this.membersChart = this.chartService.createDonutChart(
          this.membersChartCanvas.nativeElement,
          data
        );
      },
      (error: any) => {
        console.error('Error fetching chart data:', error);
      }
    );
  }
  requestPayout() {
    if (!this.paypalEmail) {
      console.error('PayPal email is required');
      return;
    }

    if (this.currentBalance <= 0) {
      console.error('Cannot request payout with zero or negative balance');
      return;
    }

    const payoutRequest = {
      owner_id: this.ownerId,
      amount: this.currentBalance,
      paypalEmail: this.paypalEmail.trim(),
    };

    console.log('Sending payout request:', payoutRequest);

    this.payoutService.requestPayout(payoutRequest).subscribe({
      next: (response) => {
        console.log('Payout requested successfully:', response);
        this.showPayoutForm = false;
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Error requesting payout:', error);
        if (error.status === 400) {
          console.error('Invalid request data:', error.error);
        }
      },
    });
  }
}
