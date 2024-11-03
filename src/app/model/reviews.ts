import { User } from "./user";

export interface Review {
  _id: string;
  rating: number; 
  comment: {
    en: string; 
    ar: string; 
  };
  replies: Reply[]; 
  categories: {
    Staff: number;
    Location: number; 
    Facilities: number; 
    Services: number;
    Comfort: number; 
    Cleanliness: number; 
    View: number; 
    Food: number; 
    Price: number;
    Room: number;
  };
  hotelId: string; 
  userId: User; 
  apartmentId?: string; 
}

export interface Reply {
  from: string; 
  message: string; 
}