import { Component } from '@angular/core';
import { HotelService } from '../../service/hotel.service';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-edit-property',
  standalone: true,
  imports: [CommonModule], // Include CommonModule in imports
  templateUrl: './edit-property.component.html',
  styleUrls: ['./edit-property.component.css']
})
export class EditPropertyComponent {
  hotels: any[] = []; // Using any type for hotels

  constructor(private hotelService: HotelService) {}

  getHotel() {
    this.hotelService.getHotelsByOwnerId().subscribe(
      data => {
        this.hotels = data; // Store the fetched hotel data
        console.log(this.hotels);
      },
      error => {
        console.error('Error fetching hotels:', error);
      }
    );
  }
}
