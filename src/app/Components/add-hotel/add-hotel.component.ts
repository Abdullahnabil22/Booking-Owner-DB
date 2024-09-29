import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  bathroomAmenities,
  foodAndDrinkAmenities,
  mediaAndTechnologyAmenities,
  roomAmenities,
  roomBenefits,
} from '../../schemas/amenities';
@Component({
  selector: 'app-add-hotel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-hotel.component.html',
  styleUrl: './add-hotel.component.css',
})
export class AddHotelComponent implements OnInit {
  hotelForm!: FormGroup;
  isLoading: boolean = true;

  roomAmenities: string[] = roomAmenities;
  bathroomAmenities: string[] = bathroomAmenities;
  mediaAndTechnologyAmenities: string[] = mediaAndTechnologyAmenities;
  foodAndDrinkAmenities: string[] = foodAndDrinkAmenities;
  roomBenefits: string[] = roomBenefits;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
    this.loadBenefits(); // Load benefits
  }

  initForm() {
    this.hotelForm = this.fb.group({
      // Basic Information
      nameEn: ['', Validators.required],
      nameAr: ['', Validators.required],
      descriptionEn: ['', Validators.required],
      descriptionAr: ['', Validators.required],
      phone: ['', Validators.required],

      // Location
      location: this.fb.group({
        addressEn: ['', Validators.required],
        addressAr: ['', Validators.required],
        cityEn: ['', Validators.required],
        cityAr: ['', Validators.required],
        countryEn: ['', Validators.required],
        countryAr: ['', Validators.required],
        latitude: ['', Validators.required],
        longitude: ['', Validators.required],
      }),

      // House Rules
      houseRules: this.fb.group({
        noSmoking: [false],
        noPets: [false],
        noParties: [false],
        checkInTime: ['', Validators.required],
        checkOutTime: ['', Validators.required],
        pricePerNight: ['', Validators.required],
      }),

      // Amenities
      amenities: this.fb.group({
        room: this.fb.group(this.createAmenitiesGroup(this.roomAmenities)),
        bathroom: this.fb.group(
          this.createAmenitiesGroup(this.bathroomAmenities)
        ),
        mediaAndTechnology: this.fb.group(
          this.createAmenitiesGroup(this.mediaAndTechnologyAmenities)
        ),
        foodAndDrink: this.fb.group(
          this.createAmenitiesGroup(this.foodAndDrinkAmenities)
        ),
      }),

      // Room Types
      roomTypes: this.fb.array([]),
    });
  }

  createAmenitiesGroup(amenities: string[]): any {
    return amenities.reduce(
      (acc, amenity) => ({ ...acc, [amenity]: false }),
      {}
    );
  }

  // Getter for roomTypes FormArray
  get roomTypesFormArray() {
    return this.hotelForm.get('roomTypes') as FormArray;
  }

  // Method to add a new Room Type
  addRoomType() {
    const roomType = this.fb.group({
      nameEn: ['', Validators.required],
      nameAr: ['', Validators.required],
      descriptionEn: ['', Validators.required],
      descriptionAr: ['', Validators.required],
      beds: ['', Validators.required],
      numberOfRooms: ['', Validators.required],
      benefits: this.fb.group(this.createBenefitsGroup(this.roomBenefits)),
    });
    this.roomTypesFormArray.push(roomType);
  }

  // Create benefits form group
  createBenefitsGroup(benefits: string[]): any {
    return benefits.reduce(
      (acc, benefit) => ({ ...acc, [benefit]: false }),
      {}
    );
  }

  // Remove Room Type by index
  removeRoomType(index: number) {
    this.roomTypesFormArray.removeAt(index);
  }

  // Submit Form
  onSubmit() {
    if (this.hotelForm.valid && !this.isLoading) {
      // Check loading state
      console.log(this.hotelForm.value);
      // Make API call to submit hotel data
    } else {
      console.log('Form is invalid or still loading');
    }
  }

  loadBenefits() {
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
}
