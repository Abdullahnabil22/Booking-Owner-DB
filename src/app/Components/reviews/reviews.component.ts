import { Component, OnInit } from '@angular/core';
import { ReviewsService } from '../../Services/reviews/reviews.service';
import { UserService } from '../../Services/user/user.service';
import { ActivatedRoute } from '@angular/router';
import { Review } from '../../model/reviews'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {
  hotelId: string | null = null;
  reviews: Review[] = [];
  replyInputVisible: { [key: string]: boolean } = {};
  replyText: { [key: string]: string } = {};
  userNames: { [key: string]: string } = {}; // لتخزين أسماء المستخدمين

  constructor(
    private route: ActivatedRoute, 
    private reviewService: ReviewsService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.hotelId = params.get('id');
      if (this.hotelId) {
        this.loadReviews(this.hotelId);
      }
    });
  }

  loadReviews(hotelId: string): void {
    this.reviewService.getReviewsByHotelId(hotelId).subscribe(reviews => {
      this.reviews = reviews;
      this.loadUserNames(); 
    });
  }

  loadUserNames(): void {
    this.reviews.forEach(review => {
      this.userService.getUserById(review.userId).subscribe(user => {
        if (user && user.userName) {
          this.userNames[review.userId] = user.userName
        }
      });
    });
  }

  showReplyInput(reviewId: string) {
    this.replyInputVisible[reviewId] = !this.replyInputVisible[reviewId];
  }

  addReply(reviewId: string) {
    const reply = this.replyText[reviewId];
    if (reply) {
      this.reviewService.addReply(reviewId, reply).subscribe(response => {
        const review = this.reviews.find(r => r._id === reviewId);
        if (review) {
          review.replies.push({ from: 'You', message: reply });
          this.replyText[reviewId] = '';
        }
      });
    }
  }
}