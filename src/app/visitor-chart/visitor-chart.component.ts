import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { HotelService } from '../Services/hotel/hotel.service';

Chart.register(...registerables);

@Component({
  selector: 'app-visitor-chart',
  templateUrl: './visitor-chart.component.html',
  styleUrls: ['./visitor-chart.component.css']
})
export class VisitorChartComponent implements OnInit, OnChanges {
  @Input() hotelId = "66fd6d630a422c7e59abc300";

  private chart: Chart | undefined;

  constructor(private hotelService: HotelService) {}

  ngOnInit() {
    this.loadVisitorData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['hotelId'] && !changes['hotelId'].firstChange) {
      this.loadVisitorData();
    }
  }

  private loadVisitorData() {
    if (!this.hotelId) {
      console.error('Hotel ID is not provided');
      return;
    }

    this.hotelService.getVisitors(this.hotelId).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.createChart(data);
        } else {
          console.error('No visitor data available');
        }
      },
      (error) => {
        console.error('Error fetching visitor data:', error);
      }
    );
  }

  private createChart(visitorData: any[]) {
    const ctx = document.getElementById('visitorChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Canvas element not found');
      return;
    }

    // Destroy existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    const dates = visitorData.map(item => new Date(item.date).toLocaleDateString());
    const counts = visitorData.map(item => item.count);

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Hotel Visitors',
          data: counts,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Visitors'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          }
        }
      }
    });
  }
}