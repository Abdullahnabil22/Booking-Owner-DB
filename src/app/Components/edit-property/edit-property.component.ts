import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hotel } from '../../model/hotel';
import { HotelService } from '../../Services/hotel/hotel.service';
import { JWTService } from '../../Services/JWT/jwt.service';
import { Router } from '@angular/router'; // Ensure Router is imported



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


  constructor(private hotelService: HotelService, private jwtService: JWTService, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    console.log('Token:', token);

    if (token) {
      const decodedToken = this.jwtService.decodeToken(token);
      this.userId = decodedToken.id; 
      console.log('User ID:', this.userId);

      if (this.userId) {
        this.hotelService.getUserHotels(this.userId).subscribe(
          (data: Hotel[]) => {
            this.hotels = data;
            console.log('Fetched hotels:', this.hotels); 
          },
          (error) => {
            console.error('Error fetching hotels:', error); 
          }
        );
      } else {
        console.error('User ID not found in token.');
      }
    } else {
      console.error('Token not found.');
    }
  }


  onUpdateHotel(hotelid: string) {
    this.router.navigate(['/edit-Hotel', hotelid]); 

}
onDeleteHotel(hottelId: string): void {
  console.log(hottelId),

  this.hotelService.deleteHotelById(hottelId).subscribe({

    next: () => {
      console.log('hotel deleted successfully');
     
    },
    error: (err) => {
      console.error('Error deleting hotel:', err);
    }
  });
 
}

}
