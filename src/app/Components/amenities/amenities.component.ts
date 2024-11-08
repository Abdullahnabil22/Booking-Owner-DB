import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  roomAmenities,
  bathroomAmenities,
  mediaAndTechnologyAmenities,
  foodAndDrinkAmenities,
  servicesAndExtrasAmenities,
  outdoorAndViewAmenities,
  accessibilityAmenities,
  entertainmentAndFamilyServicesAmenities,
  facilitiesAmenities,
} from '../../schemas/amenities';
import { AmenitiesService } from '../../Services/Amenities/amenities.service';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-amenities',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LoadingComponent],
  templateUrl: './amenities.component.html',
  styleUrl: './amenities.component.css',
})
export class AmenitiesComponent {
  amenitiesForm!: FormGroup;
  hotelId!: string;
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
    { name: 'facilities', title: 'Facilities', amenities: facilitiesAmenities },
  ];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private amenitiesService: AmenitiesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.hotelId = this.route.snapshot.paramMap.get('id') || '';
    this.initForm();
  }

  initForm() {
    const formGroup: { [key: string]: FormGroup } = {};
    this.amenityGroups.forEach((group) => {
      const groupControls: { [key: string]: boolean } = {};
      group.amenities.forEach((amenity) => {
        groupControls[this.camelCase(amenity)] = false;
      });
      formGroup[group.name] = this.fb.group(groupControls);
    });
    this.amenitiesForm = this.fb.group(formGroup);
  }

  camelCase(str: string): string {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
  }

  onSubmit() {
    if (this.amenitiesForm.valid) {
      this.isLoading = true;
      const formattedAmenities = this.formatAmenities(this.amenitiesForm.value);

      this.amenitiesService
        .postAmenitiesByHotelId(this.hotelId, formattedAmenities)
        .subscribe(
          (response) => {
            this.isLoading = false;
            this.router.navigate(['/add-property/room/' + this.hotelId]);
          },
          (error) => {
            this.isLoading = false;
            console.error('Error posting amenities', error);
          }
        );
    }
  }

  formatAmenities(formValue: any): any {
    const formattedAmenities: any = {};
    for (const [groupName, groupValue] of Object.entries(formValue)) {
      formattedAmenities[groupName] = {};
      for (const [amenityName, value] of Object.entries(groupValue as object)) {
        const capitalizedAmenityName =
          amenityName.charAt(0).toUpperCase() + amenityName.slice(1);
        formattedAmenities[groupName][capitalizedAmenityName] = Boolean(value);
      }
    }
    return formattedAmenities;
  }

  onPrevious() {
    this.router.navigate(['/add-property/hotel']);
  }
}
