import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RoomsService } from '../../Services/rooms/rooms.service';
import { benefitGroups, roomBenefits } from '../../schemas/roomBenfites';

@Component({
  selector: 'app-add-room',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-room.component.html',
  styleUrl: './add-room.component.css',
})
export class AddRoomComponent {
  roomForm!: FormGroup;
  hotelId!: string;
  benefitGroups = benefitGroups;

  roomTypeOptions = [
    { en: 'Deluxe Single', ar: 'ديلوكس مفرد' },
    { en: 'Deluxe Double', ar: 'ديلوكس مزدوج' },
    { en: 'Standard Single', ar: 'مفرد' },
    { en: 'Standard Double', ar: 'مزدوج' },
  ];

  constructor(
    private fb: FormBuilder,
    private roomsService: RoomsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.hotelId = this.route.snapshot.paramMap.get('id') || '';
    this.initForm();
  }

  initForm(): void {
    this.roomForm = this.fb.group({
      roomTypes: this.fb.array([]),
    });
    this.addRoomType();
  }

  get roomTypes(): FormArray {
    return this.roomForm.get('roomTypes') as FormArray;
  }

  addRoomType(): void {
    const roomTypeForm = this.fb.group({
      name: this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required],
      }),
      description: this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required],
      }),
      subDescription: this.fb.group({
        en: ['', [Validators.required, Validators.maxLength(100)]],
        ar: ['', [Validators.required, Validators.maxLength(100)]],
      }),
      roomType: this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required],
      }),
      beds: this.fb.group({
        KingBed: [0, [Validators.required, Validators.min(0)]],
        QueenBed: [0, [Validators.required, Validators.min(0)]],
        TwinBed: [0, [Validators.required, Validators.min(0)]],
        SofaBed: [0, [Validators.required, Validators.min(0)]],
        SingleBed: [0, [Validators.required, Validators.min(0)]],
      }),
      numberOfRoomsWithThisType: [1, [Validators.required, Validators.min(1)]],
      benefits: this.createBenefitsFormGroup(),
      price: [0, [Validators.required, Validators.min(1)]],
      available: [true],
    });

    this.roomTypes.push(roomTypeForm);
  }

  createBenefitsFormGroup(): FormGroup {
    const benefitsGroup: { [key: string]: boolean } = {};
    roomBenefits.forEach((benefit) => {
      benefitsGroup[this.camelCase(benefit)] = false;
    });
    return this.fb.group(benefitsGroup);
  }

  camelCase(str: string): string {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
  }

  removeRoomType(index: number): void {
    this.roomTypes.removeAt(index);
  }

  onRoomTypeChange(event: Event, index: number): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    const selectedType = this.roomTypeOptions.find(
      (option) => option.en === selectedValue
    );
    if (selectedType) {
      const roomTypeForm = this.roomTypes.at(index);
      roomTypeForm.get('roomType')?.patchValue({
        en: selectedType.en,
        ar: selectedType.ar,
      });
    }
  }

  onSubmit(): void {
    if (this.roomForm.valid) {
      const roomTypes = this.roomForm.value.roomTypes.map((roomType: any) => ({
        ...roomType,
        hotelID: this.hotelId,
        roomType: {
          en: roomType.roomType.en,
          ar: roomType.roomType.ar,
        },
      }));

      roomTypes.forEach((roomType: any) => {
        this.roomsService
          .createRoomTypeByHotelId(this.hotelId, roomType)
          .subscribe(
            (response) => {
              console.log('Room type added successfully', response);
            },
            (error) => {
              console.error('Error adding room type', error);
            }
          );
      });
      this.router.navigate(['/add-property']);
    } else {
      console.error('Form is invalid', this.roomForm.errors);
    }
  }
  onPrevious() {
    this.router.navigate(['/add-property/amenities', this.hotelId]);
  }
}
