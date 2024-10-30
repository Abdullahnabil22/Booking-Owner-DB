// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Review } from '../../model/reviews';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class ReviewsService {

//   private apiUrl = 'http://localhost:3000/review'; // تأكد من تعديل هذا إلى عنوان API الخاص بك

//   constructor(private http: HttpClient) {}

//   getReviewsByHotelId(hotelId: string): Observable<Review[]> {
//     const result= this.http.get<any[]>(`${this.apiUrl}/hotel/${hotelId}`)
//     console.log("result",result)
//     return result
//   }


// }


import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Review } from '../../model/reviews';
import { Observable } from 'rxjs';
import { log } from 'console';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  private apiUrl = 'http://localhost:3000/reviews'; // تأكد من تعديل هذا إلى عنوان API الخاص بك

  constructor(private http: HttpClient) {}

  getReviewsByHotelId(hotelId: string): Observable<Review[]> {
    const result= this.http.get<Review[]>(`${this.apiUrl}/hotel/${hotelId}`); 
    console.log("result",result)
    return result
  }
}