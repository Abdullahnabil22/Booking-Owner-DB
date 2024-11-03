import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApartmentService } from '../../Services/Apartment/apartment.service';
import { Apartment } from '../../model/Appartement';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-apartment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-apartment.component.html',
  styleUrls: ['./edit-apartment.component.css'],
})
export class EditApartmentComponent implements OnInit {
  apartmentForm: FormGroup;
  apartment: Apartment | null = null;
  selectedFiles: File[] = [];
  imagePreviewUrls: string[] = [];
  errorMessage: string | null = null;
  facilitiesList: string[] = [
    'WiFi',
    'Parking',
    'AirConditioning',
    'SwimmingPool',
    'Gym',
  ];
  addressInput: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private apartmentService: ApartmentService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.apartmentForm = this.initForm();
  }

  initForm(): FormGroup {
    return this.formBuilder.group({
      name: this.formBuilder.group({
        en: ['', Validators.required],
        ar: ['', Validators.required],
      }),
      description: this.formBuilder.group({
        en: ['', Validators.required],
        ar: ['', Validators.required],
      }),
      subDescription: this.formBuilder.group({
        en: ['', Validators.required],
        ar: ['', Validators.required],
      }),
      phone: ['', Validators.required],
      location: this.formBuilder.group({
        address: this.formBuilder.group({
          en: ['', Validators.required],
          ar: ['', Validators.required],
        }),
        city: this.formBuilder.group({
          en: ['', Validators.required],
          ar: ['', Validators.required],
        }),
        country: this.formBuilder.group({
          en: ['', Validators.required],
          ar: ['', Validators.required],
        }),
      }),
      HouseRules: this.formBuilder.group({
        NoSmoking: [false],
        NoPets: [false],
        NoParties: [false],
        CheckInTime: ['', Validators.required],
        CheckOutTime: ['', Validators.required],
        PricePerNight: [0, [Validators.required, Validators.min(1)]],
        Cancellation: this.formBuilder.group({
          Policy: this.formBuilder.group({
            en: [''],
            ar: [''],
          }),
          Refundable: [false],
          DeadlineDays: [0, Validators.min(0)],
        }),
      }),
      Rooms: this.formBuilder.group({
        Bedrooms: [0, [Validators.required, Validators.min(0)]],
        Bathrooms: [0, [Validators.required, Validators.min(0)]],
        LivingRooms: [0, [Validators.required, Validators.min(0)]],
        Kitchen: [0, [Validators.required, Validators.min(0)]],
        Balcony: [0, [Validators.required, Validators.min(0)]],
      }),
      Facilities: this.formBuilder.group(
        this.facilitiesList.reduce(
          (acc, facility) => ({ ...acc, [facility]: [false] }),
          {}
        )
      ),
    });
  }

  ngOnInit(): void {
    const apartmentId = this.activatedRoute.snapshot.paramMap.get('id');
    if (apartmentId) {
      this.apartmentService.getAppartmentById(apartmentId).subscribe(
        (data: Apartment) => {
          this.apartment = data;
          this.apartmentForm.patchValue(data);
          if (this.apartment.images && this.apartment.images.length > 0) {
            this.imagePreviewUrls = this.apartment.images;
          }
        },
        (error) => {
          console.error('Error fetching apartment:', error);
          this.errorMessage = 'Failed to load apartment data.';
        }
      );
    }
  }

  onFileSelect(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      const newFiles = Array.from(fileList);
      this.selectedFiles = [...this.selectedFiles, ...newFiles];
      this.generateImagePreviews(newFiles);
    }
  }

  generateImagePreviews(files: File[]): void {
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrls.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.imagePreviewUrls.splice(index, 1);
  }

  onSubmit(): void {
    if (this.apartmentForm.valid) {
      const updatedApartment: Apartment = {
        ...this.apartmentForm.value,
        _id: this.apartment?._id,
      };
      this.updateApartment(updatedApartment);
    } else {
      this.errorMessage = 'Please fill all required fields correctly.';
    }
  }

  updateApartment(updatedApartment: Apartment): void {
    if (this.selectedFiles.length > 0) {
      this.uploadFiles().then((uploadedImageUrls) => {
        updatedApartment.images = [
          ...(updatedApartment.images || []),
          ...uploadedImageUrls,
        ];
        this.sendUpdateRequest(updatedApartment);
      });
    } else {
      this.sendUpdateRequest(updatedApartment);
    }
  }

  uploadFiles(): Promise<string[]> {
    // Implement file upload logic here
    return Promise.resolve([]); // Placeholder
  }

  sendUpdateRequest(updatedApartment: Apartment): void {
    if (updatedApartment._id) {
      this.apartmentService
        .updateDepartmentById(updatedApartment._id)
        .subscribe(
          () => {
            console.log('Apartment updated successfully');
            this.successUpdate();
          },
          (error) => {
            console.error('Error updating apartment:', error);
            this.errorMessage = 'Failed to update apartment. Please try again.';
          }
        );
    } else {
      this.errorMessage = 'Apartment ID is missing.';
    }
  }

  successUpdate(): void {
    this.router.navigate(['/edit-property']);
  }

  onAddressInput(event: Event): void {
    this.addressInput = (event.target as HTMLInputElement).value;
    // Implement address search logic here
  }
}
