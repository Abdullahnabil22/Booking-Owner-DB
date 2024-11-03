import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
Chart.register(...registerables);

@Injectable({
  providedIn: 'root',
})
export class ChartsService {
  constructor(private http: HttpClient) {}

  getEarningsData(ownerId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/earnings/${ownerId}`);
  }

  createChart(ctx: HTMLCanvasElement, data: any): Chart {
    const labels = this.getUniqueLabels(
      data.apartmentBookings,
      data.hostBookings
    );
    const apartmentData = this.formatChartData(data.apartmentBookings, labels);
    const hostData = this.formatChartData(data.hostBookings, labels);

    console.log('Processed Chart Data:', {
      labels,
      apartmentData,
      hostData,
    });

    const chartConfig: ChartConfiguration = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Apartment Earnings',
            data: apartmentData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.1,
            fill: true,
          },
          {
            label: 'Hotel Earnings',
            data: hostData,
            borderColor: 'rgba(26, 76, 243, 1)',
            backgroundColor: 'rgba(26, 76, 243, 0.2)',
            tension: 0.1,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: 1000,
            title: {
              display: true,
              text: 'Earnings (USD)',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Month',
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false,
            text: 'Earnings Overview',
          },
        },
      },
    };

    return new Chart(ctx, chartConfig);
  }

  private getUniqueLabels(...datasets: any[]): string[] {
    const allLabels = datasets.flatMap((dataset) =>
      dataset.map((item: any) => item._id)
    );
    const uniqueLabels = [...new Set(allLabels)].sort();
    console.log('Unique labels:', uniqueLabels);
    return uniqueLabels;
  }

  private formatChartData(data: any[], labels: string[]): number[] {
    return labels.map((label) => {
      const matchingItem = data.find((item) => item._id === label);
      return matchingItem ? matchingItem.totalEarnings : 0;
    });
  }

  createDonutChart(ctx: HTMLCanvasElement, data: any): Chart {
    const apartmentMembers = data.apartmentBookings.reduce(
      (sum: number, booking: any) => sum + booking.totalMembers,
      0
    );
    const hostMembers = data.hostBookings.reduce(
      (sum: number, booking: any) => sum + booking.totalMembers,
      0
    );

    const chartConfig: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: ['Apartment Members', 'Hotel Members'],
        datasets: [
          {
            data: [apartmentMembers, hostMembers],
            backgroundColor: [
              'rgba(75, 192, 192, 0.8)',
              'rgba(26, 76, 243, 0.8)',
            ],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false,
            text: 'Total Members Distribution',
          },
        },
      },
    };

    return new Chart(ctx, chartConfig);
  }
}
