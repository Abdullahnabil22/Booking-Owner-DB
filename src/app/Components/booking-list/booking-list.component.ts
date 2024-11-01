import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingListService } from '../../Services/BookingList/booking-list.service';
import { CommonModule } from '@angular/common';
import { Booking } from '../../model/Booking'; 

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css']
})
export class BookingListComponent implements OnInit {
  hostId: string = "";
  bookings: Booking[] = []; 

  constructor(private route: ActivatedRoute, private BookingListService: BookingListService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.hostId = params['id'];
      this.getBookingsByHostId(this.hostId);
    });
  }

  getBookingsByHostId(id: string) {
    this.BookingListService.getBookingsByHostId(id).subscribe(
      (data) => {
        this.bookings = data; 
        console.log('Bookings:', this.bookings);
      },
      (error) => {
        console.error('Error fetching bookings:', error);
      }
    );
  }
}
