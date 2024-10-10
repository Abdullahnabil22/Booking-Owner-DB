export interface Hotel {
  _id: string; 
  ownerId: string;
  name: {
    en: string; 
    ar: string; 
  };
  subDescription: {
    en: string;
    ar: string; 
  };
  description: {
    en: string;
    ar: string; 
  };
  location: {
    Address: {
      en: string; 
      ar: string; 
    };
    city: {
      en: string; 
      ar: string; 
    };
    country: {
      en: string; 
      ar: string; 
    };
  };
  images: string[]; 
  AverageRating: number; 
  ReviewCount: number; 
  approved: boolean;
  PricePerNight: number;
  CheckInTime: string; 
  CheckOutTime: string; 
  HouseRules: {
    NoParties: boolean; 
    NoPets: boolean; 
    NoSmoking: boolean;
    Cancellation: {
      Policy: {
        en: string;
        ar: string;
      };
      Refundable: boolean; 
      DeadlineDays: number; 
    };
  };
  phone: string | number; 
  CreatedAt: string;
  UpdatedAt: string; 
}