import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hotel } from '../../model/hotel';
import { HotelService } from '../../Services/hotel/hotel.service';
import { JWTService } from '../../Services/JWT/jwt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-property',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-property.component.html',
  styleUrls: ['./edit-property.component.css']
})
export class EditPropertyComponent implements OnInit {
  hotels: Hotel[] = [];
  userId: string | null = null;
  expandedIndex: number = -1; // Add this line

  constructor(
    private hotelService: HotelService,
    private jwtService: JWTService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    console.log('Token:', token);

    if (token) {
      const decodedToken = this.jwtService.decodeToken(token);
      this.userId = decodedToken.id; 
      console.log('User ID:', this.userId);

      if (this.userId) {
        this.loadHotels();
      } else {
        console.error('User ID not found in token.');
      }
    } else {
      console.error('Token not found.');
    }
  }

  loadHotels(): void {
    if (this.userId) {
      this.hotelService.getUserHotels(this.userId).subscribe({
        next: (data: Hotel[]) => {
          this.hotels = data;
          console.log('Fetched hotels:', this.hotels[0].location);
        },
        error: (error) => {
          console.error('Error fetching hotels:', error);
        }
      });
    }
  }

  onUpdateHotel(hotelId: string): void {
    this.router.navigate([ '/edit-Hotel', hotelId]);
    
  }

  onDeleteHotel(hotelId: string): void {
    console.log(hotelId);
    this.hotelService.deleteHotelById(hotelId).subscribe({
      next: () => {
        console.log('Hotel deleted successfully');
        this.loadHotels(); 
      },
      error: (err) => {
        console.error('Error deleting hotel:', err);
      }
    });
  }

  toggleDetails(index: number): void {
    if (this.expandedIndex === index) {
      this.expandedIndex = -1;
    } else {
      this.expandedIndex = index;
    }
  }
}