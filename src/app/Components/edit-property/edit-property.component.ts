import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    private apartmentService: ApartmentService,
    private cdr: ChangeDetectorRef // إضافة ChangeDetectorRef
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
          console.log('Fetched hotels:', this.hotels);
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

  navigateToReviews(hotelId: string): void {
    this.router.navigate(['/reviews', hotelId]);
  }

  onDeleteHotel(hotelId: string): void {     
    const confirmed = confirm('Are you sure you want to disable this hotel?');     
    if (confirmed) {       
      const hotel = this.hotels.find(h => h._id === hotelId); 
      if (hotel) {         
        this.hotelService.disableHotelById(hotelId).subscribe({
          next: (response) => {
            console.log('API Response:', response);
            hotel.isDisabled = true; 
            console.log(`Hotel with ID ${hotelId} is now disabled.`); 
            this.hotels = [...this.hotels]; 
            this.cdr.detectChanges(); // تحديث واجهة المستخدم
          },
          error: (err) => {
            console.error('Error disabling hotel:', err);
          }
        });
      } 
    } 
  }

  toggleDetails(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? -1 : index;
  }

  toggleApartmentDetails(index: number): void {
    this.expandedApartmentIndex = this.expandedApartmentIndex === index ? -1 : index;
  }

  onUpdateApartment(apartmentId: string): void {
    this.router.navigate(['/edit-Apartment', apartmentId]);
  }

  getEnabledFacilities(facilities: { [key: string]: boolean }): string[] {
    return Object.keys(facilities).filter(key => facilities[key]);
  }

  getFacilities(facilities: { [key: string]: boolean }): { name: string, available: boolean }[] {
    return Object.entries(facilities).map(([name, available]) => ({ name, available }));
  }

  navigateToBookingList(hotelId: string) {
    this.router.navigate(['/BookingList', hotelId]);
  }
}