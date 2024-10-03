import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

import { ApartmentService } from '../../Services/Apartment/apartment.service';

@Component({
  selector: 'app-add-apartment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './add-apartment.component.html',
  styleUrl: './add-apartment.component.css',
})
export class AddApartmentComponent {
  apartmentForm!: FormGroup;
  selectedFiles: File[] = [];
  errorMessage: string = '';
  facilitiesList = [
    'WiFi',
    'Air Conditioning',
    'Parking',
    'Swimming Pool',
    'Gym',
    'Washing Machine',
    'Dryer',
    'Iron',
    'Hair Dryer',
    'Ironing Board',
    'TV',
    'Cable TV',
    'DVD Player',
    'CD Player',
    'Radio',
    'Alarm Clock',
    'Microwave',
    'Refrigerator',
    'Oven',
  ];

  constructor(
    private fb: FormBuilder,
    private apartmentService: ApartmentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.apartmentForm = this.fb.group({
      name: this.fb.group({
        en: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ],
        ],
        ar: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ],
        ],
      }),
      description: this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required],
      }),
      subDescription: this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required],
      }),
      phone: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      location: this.fb.group({
        address: this.fb.group({
          en: ['', Validators.required],
          ar: ['', Validators.required],
        }),
        city: this.fb.group({
          en: ['', Validators.required],
          ar: ['', Validators.required],
        }),
        country: this.fb.group({
          en: ['', Validators.required],
          ar: ['', Validators.required],
        }),
      }),
      HouseRules: this.fb.group({
        NoSmoking: [false],
        NoPets: [false],
        NoParties: [false],
        CheckInTime: ['', Validators.required],
        CheckOutTime: ['', Validators.required],
        PricePerNight: ['', [Validators.required, Validators.min(1)]],
        Cancellation: this.fb.group({
          Policy: this.fb.group({
            en: ['', Validators.required],
            ar: ['', Validators.required],
          }),
          Refundable: [false],
          DeadlineDays: ['', [Validators.required, Validators.min(0)]],
        }),
      }),
      Rooms: this.fb.group({
        Bedrooms: ['', [Validators.required, Validators.min(0)]],
        Bathrooms: ['', [Validators.required, Validators.min(0)]],
        LivingRooms: ['', [Validators.required, Validators.min(0)]],
        Kitchen: ['', [Validators.required, Validators.min(0)]],
        Balcony: ['', [Validators.required, Validators.min(0)]],
      }),
      Facilities: this.fb.group(
        this.facilitiesList.reduce((acc, facility) => {
          acc[facility] = [false];
          return acc;
        }, {} as { [key: string]: boolean[] })
      ),
      images: [[], Validators.required],
    });
  }

  onFileSelect(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      this.selectedFiles = [...this.selectedFiles, ...Array.from(fileList)];
      this.apartmentForm.patchValue({ images: this.selectedFiles });
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
    this.apartmentForm.patchValue({ images: this.selectedFiles });
  }

  onSubmit() {
    if (this.apartmentForm.valid && this.selectedFiles.length > 0) {
      const formData = this.apartmentForm.value;
      formData.images = this.selectedFiles;
      this.apartmentService
        .createApartment(formData, this.selectedFiles)
        .subscribe(
          (response) => {
            console.log('Apartment created successfully', response);
            this.router.navigate(['/add-property']);
          },
          (error) => {
            console.error('Error creating apartment', error);
            this.errorMessage =
              error.error.message ||
              'An error occurred while creating the apartment. Please try again.';
          }
        );
    } else {
      this.errorMessage =
        'Please fill in all required fields and select at least one image.';
      Object.keys(this.apartmentForm.controls).forEach((key) => {
        const control = this.apartmentForm.get(key);
        control!.markAsTouched();
      });
    }
  }
}
