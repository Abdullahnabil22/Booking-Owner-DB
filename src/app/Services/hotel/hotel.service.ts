import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  addHotel(hotel: any): Observable<any> {
    const hostData = this.prepareHostData(hotel);
    const amenitiesData = this.prepareAmenitiesData(hotel.amenities);

    return this.uploadImages(hotel.photos).pipe(
      switchMap((photoUrls: string[]) => {
        hostData.photos = photoUrls;
        return this.http.post<any>(`${this.apiUrl}/host`, hostData, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }),
        });
      }),
      switchMap((hostResponse: any) => {
        return this.http.post<any>(`${this.apiUrl}/amenities`, {
          ...amenitiesData,
          hostId: hostResponse.data._id,
        });
      })
    );
  }

  getUserHotels(userId: string): Observable<any> {
    console.log("Fetching hotels for user:", userId);
    return this.http.get(`${this.apiUrl}/host/owner/${userId}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is needed
      }),
    });
  }

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http
      .post<any>(`${this.apiUrl}/cloudinary/upload`, formData)
      .pipe(map((response) => response.secure_url));
  }

  uploadImages(files: File[]): Observable<string[]> {
    const uploadObservables = files.map((file) => this.uploadImage(file));
    return forkJoin(uploadObservables);
  }

  private prepareHostData(formData: any): any {
    return {
      name: {
        en: formData.nameEn,
        ar: formData.nameAr,
      },
      description: {
        en: formData.descriptionEn,
        ar: formData.descriptionAr,
      },
      subDescription: {
        en: formData.subDescriptionEn,
        ar: formData.subDescriptionAr,
      },
      phone: formData.phone,
      location: {
        Address: {
          en: formData.location.addressEn,
          ar: formData.location.addressAr,
        },
        city: {
          en: formData.location.cityEn,
          ar: formData.location.cityAr,
        },
        country: {
          en: formData.location.countryEn,
          ar: formData.location.countryAr,
        },
      },
      HouseRules: {
        NoSmoking: formData.houseRules.noSmoking,
        NoPets: formData.houseRules.noPets,
        NoParties: formData.houseRules.noParties,
        CheckInTime: formData.houseRules.checkInTime,
        CheckOutTime: formData.houseRules.checkOutTime,
        PricePerNight: formData.houseRules.pricePerNight,
        Cancellation: {
          Policy: {
            en: formData.houseRules.cancellationPolicyEn,
            ar: formData.houseRules.cancellationPolicyAr,
          },
          Refundable: formData.houseRules.isRefundable,
          DeadlineDays: formData.houseRules.deadlineDays,
        },
      },
    };
  }

  private prepareAmenitiesData(amenities: any): any {
    const preparedAmenities: any = {};
    for (const [groupName, groupAmenities] of Object.entries(amenities)) {
      preparedAmenities[groupName] = {};
      for (const [amenityName, isChecked] of Object.entries(
        groupAmenities as object
      )) {
        preparedAmenities[groupName][amenityName] = {
          en: isChecked,
          ar: isChecked,
        };
      }
    }
    return preparedAmenities;
  }
}
