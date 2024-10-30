import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Review } from '../../model/reviews';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private apiUrl = 'http://localhost:3000/reviews'; // تأكد من تعديل هذا إلى عنوان API الخاص بك

  constructor(private http: HttpClient) {}

  getReviewsByHotelId(hotelId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/hotel/${hotelId}`);
  }

  addReply(reviewId: string, reply: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${reviewId}/replies`, { message: reply });
  }
}