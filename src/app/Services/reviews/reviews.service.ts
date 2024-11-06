import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Review } from '../../model/reviews';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  private apiUrl = 'http://localhost:3000/reviews';

  constructor(private http: HttpClient) {}

  getReviewsByHotelId(hotelId: string): Observable<Review[]> {
    const result = this.http.get<Review[]>(`${this.apiUrl}/hotel/${hotelId}`);
    console.log('result', result);
    console.log('Review');
    return result;
  }

  addReply(reviewId: string, reply: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${reviewId}/replies`, {
      message: reply,
    });
  }
}
