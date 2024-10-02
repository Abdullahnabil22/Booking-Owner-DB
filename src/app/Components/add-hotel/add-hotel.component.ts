import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  accessibilityAmenities,
  bathroomAmenities,
  entertainmentAndFamilyServicesAmenities,
  foodAndDrinkAmenities,
  mediaAndTechnologyAmenities,
  outdoorAndViewAmenities,
  roomAmenities,
  roomBenefits,
  servicesAndExtrasAmenities,
} from '../../schemas/amenities';
import { HotelService } from '../../Services/hotel/hotel.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

interface AmenityGroup {
  name: string;
  title: string;
  amenities: string[];
}

@Component({
  selector: 'app-add-hotel',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
  ],
  providers: [HotelService],
  templateUrl: './add-hotel.component.html',
  styleUrls: ['./add-hotel.component.css'],
})
export class AddHotelComponent implements OnInit {
  amenityGroups = [
    { name: 'room', title: 'Room Amenities', amenities: roomAmenities },
    {
      name: 'bathroom',
      title: 'Bathroom Amenities',
      amenities: bathroomAmenities,
    },
    {
      name: 'mediaAndTechnology',
      title: 'Media and Technology',
      amenities: mediaAndTechnologyAmenities,
    },
    {
      name: 'foodAndDrink',
      title: 'Food and Drink',
      amenities: foodAndDrinkAmenities,
    },
    {
      name: 'servicesAndExtras',
      title: 'Services and Extras',
      amenities: servicesAndExtrasAmenities,
    },
    {
      name: 'outdoorAndView',
      title: 'Outdoor and View',
      amenities: outdoorAndViewAmenities,
    },
    {
      name: 'accessibility',
      title: 'Accessibility',
      amenities: accessibilityAmenities,
    },
    {
      name: 'entertainmentAndFamilyServices',
      title: 'Entertainment and Family Services',
      amenities: entertainmentAndFamilyServicesAmenities,
    },
  ];

  hotelForm!: FormGroup;
  selectedFiles: File[] = [];
  isLoading = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private hotelService: HotelService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.hotelForm = this.fb.group({
      nameEn: ['', Validators.required],
      nameAr: ['', Validators.required],
      descriptionEn: ['', Validators.required],
      descriptionAr: ['', Validators.required],
      subDescriptionEn: ['', Validators.required],
      subDescriptionAr: ['', Validators.required],
      phone: ['', Validators.required],
      location: this.fb.group({
        addressEn: ['', Validators.required],
        addressAr: ['', Validators.required],
        cityEn: ['', Validators.required],
        cityAr: ['', Validators.required],
        countryEn: ['', Validators.required],
        countryAr: ['', Validators.required],
      }),
      houseRules: this.fb.group({
        noSmoking: [false],
        noPets: [false],
        noParties: [false],
        checkInTime: ['', Validators.required],
        checkOutTime: ['', Validators.required],
        pricePerNight: ['', [Validators.required, Validators.min(0)]],
        cancellationPolicyEn: [''],
        cancellationPolicyAr: [''],
        isRefundable: [false],
        deadlineDays: [''],
      }),
      amenities: this.fb.group({}),
    });

    this.addAmenityGroups();
  }

  updateProd:number=0
 

  addAmenityGroups() {
    const amenitiesGroup = this.hotelForm.get('amenities') as FormGroup;

    this.amenityGroups.forEach((group) => {
      const groupFormGroup = this.fb.group({});
      group.amenities.forEach((amenity: string) => {
        groupFormGroup.addControl(amenity, this.fb.control(false));
      });
      amenitiesGroup.addControl(group.name, groupFormGroup);
    });
  }

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  onSubmit() {
    if (this.hotelForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const formData = this.hotelForm.value;
      formData.photos = this.selectedFiles;

      this.hotelService.addHotel(formData).subscribe(
        (response) => {
          console.log('Hotel added successfully', response);
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error('Error adding hotel', error);
          this.isLoading = false;
          this.errorMessage =
            error.error.message ||
            'An error occurred while adding the hotel. Please try again.';
        }
      );
    } else {
      this.markFormGroupTouched(this.hotelForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
