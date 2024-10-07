import { Component, OnInit, AfterViewInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables, ChartConfiguration, ChartData } from 'chart.js';
import { HotelService } from './../Services/hotel/hotel.service';

Chart.register(...registerables);

@Component({
  selector: 'app-visitor-chart',
  templateUrl: './visitor-chart.component.html',
  styleUrls: ['./visitor-chart.component.css']
})
export class VisitorChartComponent implements OnInit, AfterViewInit {
  @Input() hotelId: string = '66f9f2cfa46b697f106da79c';
  @ViewChild('visitorChart') private chartRef!: ElementRef<HTMLCanvasElement>;
  private chart: Chart<'pie', number[], string> | undefined;

  constructor(private hotelService: HotelService) {}

  ngOnInit(): void {
    this.loadVisitorData();
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit called');
  }

  private loadVisitorData(): void {
    this.hotelService.getVisitors(this.hotelId).subscribe(
      (data: any) => {
        if (data) {
          console.log('Received data:', data);
          this.waitForCanvas(() => this.createChart(data));
        } else {
          console.error('No visitor data available or invalid data format');
        }
      },
      (error) => {
        console.error('Error fetching visitor data:', error);
      }
    );
  }

  private waitForCanvas(callback: () => void): void {
    if (this.chartRef && this.chartRef.nativeElement) {
      setTimeout(() => {
        callback();
      }, 100);
    } else {
      requestAnimationFrame(() => this.waitForCanvas(callback));
    }
  }

  private createChart(data: any): void {
    console.log('Creating chart with data:', data);
    if (!this.chartRef || !this.chartRef.nativeElement) {
      console.error('Chart canvas element not found');
      return;
    }

    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Unable to get 2D context for canvas');
      return;
    }

    // Calculate total visitors for hosts and apartments
    const totalHostVisitors = data.hostBookings.reduce((sum: number, item: any) => sum + item.totalMembers, 0);
    const totalApartmentVisitors = data.apartmentBookings.reduce((sum: number, item: any) => sum + item.totalMembers, 0);

    // Destroy previous chart instance if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    const chartData: ChartData<'pie', number[], string> = {
      labels: ['Host Visitors', 'Apartment Visitors'],
      datasets: [{
        data: [totalHostVisitors, totalApartmentVisitors],
        backgroundColor: [
          'rgba(91, 186, 255, 0.8)',
          'rgba(255, 91, 91, 0.8)'
        ],
        borderColor: [
          'rgba(91, 186, 255, 1)',
          'rgba(255, 91, 91, 1)'
        ],
        borderWidth: 1
      }]
    };

    const config: ChartConfiguration<'pie', number[], string> = {
      type: 'pie',
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Visitor Distribution'
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }
}