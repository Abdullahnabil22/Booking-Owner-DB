
export interface Review {
  _id: string;
  rating: number; // Rating given by the user
  comment: {
    en: string; // Comment in English
    ar: string; // Comment in Arabic
  };
  replies: Reply[]; // Array of replies to the review
  categories: {
    Staff: number; // Rating for Staff
    Location: number; // Rating for Location
    Facilities: number; // Rating for Facilities
    Services: number; // Rating for Services
    Comfort: number; // Rating for Comfort
    Cleanliness: number; // Rating for Cleanliness
    View: number; // Rating for View
    Food: number; // Rating for Food
    Price: number; // Rating for Price
    Room: number; // Rating for Room
  };
  hotelId: string; // ID of the hotel (ObjectId as string)
  userId: string; // ID of the user (ObjectId as string)
  apartmentId?: string; // ID of the apartment (ObjectId as string, optional)
}

// Define the Reply interface for replies to the review
export interface Reply {
  from: string; // The user who replied
  message: string; // The reply message
}