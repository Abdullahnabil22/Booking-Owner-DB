import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hotel } from '../../model/hotel';
import { HotelService } from '../../Services/hotel/hotel.service';
import { JWTService } from '../../Services/JWT/jwt.service';
import { Router } from '@angular/router';
import { Apartment } from '../../model/Appartement';
import { ApartmentService } from './../../Services/Apartment/apartment.service';

@Component({
  selector: 'app-edit-property',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-property.component.html',
  styleUrls: ['./edit-property.component.css']
})
export class EditPropertyComponent implements OnInit {
  hotels: Hotel[] = [];
  apartments: Apartment[] = [];
  userId: string | null = null;
  expandedIndex: number = -1;
  expandedApartmentIndex: number = -1;

  constructor(
    private hotelService: HotelService,
    private jwtService: JWTService,
    private router: Router,
    private apartmentService: ApartmentService
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
        this.loadApartments();  
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
          
          if (this.hotels.length > 0) {
            console.log('Fetched hotels:', this.hotels[0].location);
          } else {
            console.log('No hotels fetched');
          }
        },
        error: (error) => {
          console.error('Error fetching hotels:', error);
        }
      });
    }
  }

  loadApartments(): void { 
    if (this.userId) {
      this.apartments = []; 
      this.apartmentService.getUserAppartment(this.userId).subscribe({
        next: (data: Apartment | Apartment[]) => {
          if (Array.isArray(data)) {
            this.apartments = data;
          } else if (data && typeof data === 'object') {
            this.apartments = [data]; 
          } else {
            this.apartments = [];
          }
          
          console.log("Fetched apartments:", this.apartments);
          
          if (this.apartments.length > 0) {
            console.log('First apartment:', this.apartments[0]);
          } else {
            console.log('No apartments fetched');
          }
        },
        error: (error) => { 
          console.error('Error fetching apartments:', error);
          this.apartments = [];
        }
      });
    } else {
      console.error('User ID is null');
      this.apartments = []; 
    }
  }
  onUpdateHotel(hotelId: string): void {
    this.router.navigate(['/edit-Hotel', hotelId]);
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

  toggleApartmentDetails(index: number): void {
    if (this.expandedApartmentIndex === index) {
      this.expandedApartmentIndex = -1;
    } else {
      this.expandedApartmentIndex = index;
    }
  }

  onUpdateApartment(apartmentId: string): void {
   this.router.navigate(['/edit-Apartment', apartmentId]);
  }

  onDeleteApartment(apartmentId: string): void {
    console.log("id",apartmentId);
    this.apartmentService.deleteAppartmentlById(apartmentId).subscribe({
      next: () => {
        console.log('Hotel deleted successfully');
        this.loadHotels(); 
      },
      error: (err) => {
        console.error('Error deleting hotel:', err);
      }
    });
  }

  getEnabledFacilities(facilities: { [key: string]: boolean }): string[] {
    return Object.keys(facilities).filter(key => facilities[key]);
  }
  getFacilities(facilities: { [key: string]: boolean }): { name: string, available: boolean }[] {
    return Object.entries(facilities).map(([name, available]) => ({ name, available }));
  }
}