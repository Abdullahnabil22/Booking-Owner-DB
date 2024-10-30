// import { Component, OnInit } from '@angular/core';
// import { ReviewsService } from '../../Services/reviews/reviews.service';
// import { ActivatedRoute } from '@angular/router';
// import { Review } from '../../model/reviews'; 
// import { CommonModule } from '@angular/common'; // Import CommonModule

// @Component({
//   selector: 'app-reviews',
//   standalone: true,
//   imports: [CommonModule], // Add CommonModule here
//   templateUrl: './reviews.component.html',
//   styleUrls: ['./reviews.component.css'] // Corrected to styleUrls
// })
// export class ReviewsComponent implements OnInit { // Implement OnInit
//   hotelId: string | null = null;
//   reviews: Review[] = [];

//   constructor(private route: ActivatedRoute, private reviewService: ReviewsService) {}

//   ngOnInit(): void {
//     // جلب الـ id من URL
//     this.route.paramMap.subscribe(params => {
//       this.hotelId = params.get('id'); // الحصول على الـ id
//       if (this.hotelId) {
//         this.loadReviews(this.hotelId); // استدعاء الدالة لجلب المراجعات
//       }
//     });
//   }

//   loadReviews(hotelId: string): void {
//     this.reviewService.getReviewsByHotelId(hotelId).subscribe(reviews => {
//       this.reviews = reviews; // تخزين المراجعات في المتغير
//     });
//   }
// }



import { Component, OnInit } from '@angular/core';
import { ReviewsService } from '../../Services/reviews/reviews.service';
import { ActivatedRoute } from '@angular/router';
import { Review } from '../../model/reviews'; 
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule], // Add CommonModule here
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css'] // Corrected to styleUrls
})
export class ReviewsComponent implements OnInit { // Implement OnInit
  hotelId: string | null = null;
  reviews: Review[] = [];

  constructor(private route: ActivatedRoute, private reviewService: ReviewsService) {}

  ngOnInit(): void {
    // جلب الـ id من URL
    this.route.paramMap.subscribe(params => {
      this.hotelId = params.get('id'); // الحصول على الـ id
      if (this.hotelId) {
        this.loadReviews(this.hotelId); // استدعاء الدالة لجلب المراجعات
      }
    });
  }

  loadReviews(hotelId: string): void {
    this.reviewService.getReviewsByHotelId(hotelId).subscribe(reviews => {
      console.log("Received reviews:", reviews); // تحقق من البيانات
      this.reviews = reviews; // تخزين المراجعات في المتغير
    });
  }
}