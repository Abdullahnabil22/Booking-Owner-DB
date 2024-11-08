import {
  Component,
  NgZone,
  OnInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { HotelService } from '../../Services/hotel/hotel.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { HeremapsService } from '../../Services/heremaps/heremaps.service';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-add-hotel',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    LoadingComponent,
  ],
  providers: [HotelService],
  templateUrl: './add-hotel.component.html',
  styleUrls: ['./add-hotel.component.css'],
})
export class AddHotelComponent {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  hotelForm!: FormGroup;
  selectedFiles: File[] = [];
  errorMessage: string = '';
  addressInput: string = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private hotelService: HotelService,
    private hereMapsService: HeremapsService,
    private router: Router,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.initForm();
    this.hereMapsService.getLocationSelected().subscribe((coord) => {
      this.zone.run(() => {
        this.updateFormWithCoordinates(coord);
      });
    });
  }

  ngAfterViewInit() {
    this.zone.run(() => {
      setTimeout(() => {
        if (this.mapContainer && this.mapContainer.nativeElement) {
          this.hereMapsService.initMap(this.mapContainer);
        } else {
          console.error('Map container not found');
        }
      }, 0);
    });
  }

  initForm() {
    this.hotelForm = this.fb.group({
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
        Address: this.fb.group({
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
        NoSmoking: [false, Validators.required],
        NoPets: [false, Validators.required],
        NoParties: [false, Validators.required],
        CheckInTime: ['', Validators.required],
        CheckOutTime: ['', Validators.required],
        PricePerNight: ['', [Validators.required, Validators.min(1)]],
        Cancellation: this.fb.group({
          Policy: this.fb.group({
            en: [''],
            ar: [''],
          }),
          Refundable: [false],
          DeadlineDays: ['', [Validators.required, Validators.min(0)]],
        }),
      }),
      images: [[], Validators.required],
    });
  }

  onAddressInput(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    this.addressInput = input;

    if (input.length > 3) {
      this.searchAddress(input);
    }
  }

  searchAddress(query: string) {
    this.hereMapsService.searchAddress(query).subscribe(
      (location) => {
        this.zone.run(() => {
          this.updateFormWithAddress(location);
        });
      },
      (error) => {
        console.error('Error searching address:', error);
      }
    );
  }

  updateFormWithAddress(location: any) {
    const addressEn = location.en.address;
    const addressAr = location.ar.address;

    this.hotelForm.patchValue({
      location: {
        Address: {
          en: addressEn.label || '',
          ar: addressAr.label || '',
        },
        city: {
          en: addressEn.city || '',
          ar: addressAr.city || '',
        },
        country: {
          en: addressEn.countryName || '',
          ar: addressAr.countryName || '',
        },
      },
    });
  }

  updateFormWithCoordinates(coord: any) {
    this.hereMapsService.searchAddress(`${coord.lat},${coord.lng}`).subscribe(
      (location) => {
        this.zone.run(() => {
          this.updateFormWithAddress(location);
        });
      },
      (error) => {
        console.error('Error reverse geocoding:', error);
      }
    );
  }
  onFileSelect(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      this.selectedFiles = [...this.selectedFiles, ...Array.from(fileList)];
      this.hotelForm.patchValue({ images: this.selectedFiles });
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
    this.hotelForm.patchValue({ images: this.selectedFiles });
  }

  get nameEnInvalid() {
    const control = this.hotelForm.get('name.en');
    return control?.invalid && (control?.dirty || control?.touched);
  }

  get nameArInvalid() {
    const control = this.hotelForm.get('name.ar');
    return control?.invalid && (control?.dirty || control?.touched);
  }

  get descriptionEnInvalid() {
    const control = this.hotelForm.get('description.en');
    return control?.invalid && (control?.dirty || control?.touched);
  }

  get descriptionArInvalid() {
    const control = this.hotelForm.get('description.ar');
    return control?.invalid && (control?.dirty || control?.touched);
  }

  get phoneInvalid() {
    const control = this.hotelForm.get('phone');
    return control?.invalid && (control?.dirty || control?.touched);
  }

  onSubmit() {
    if (this.hotelForm.valid && this.selectedFiles.length > 0) {
      this.isLoading = true;
      const formData = this.hotelForm.value;
      formData.images = this.selectedFiles;

      this.hotelService.createHotel(formData, this.selectedFiles).subscribe(
        (response) => {
          this.isLoading = false;
          this.router.navigate([
            '/add-property/amenities/' + response.data._id,
          ]);
        },
        (error) => {
          this.isLoading = false;
          console.error('Error creating hotel', error);
          this.errorMessage =
            error.error.message ||
            'An error occurred while creating the hotel. Please try again.';
        }
      );
    } else {
      this.errorMessage =
        'Please fill in all required fields and select at least one image.';
      Object.keys(this.hotelForm.controls).forEach((key) => {
        const control = this.hotelForm.get(key);
        if (control instanceof FormGroup) {
          Object.keys(control.controls).forEach((nestedKey) => {
            control.get(nestedKey)?.markAsTouched();
          });
        } else {
          control?.markAsTouched();
        }
      });
    }
  }
}
