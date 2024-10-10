export interface Apartment {
  _id: string;  // Added for unique identifier
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  subDescription: {
    en: string;
    ar: string;
  };
  phone: string;
  location: {
    address: {
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
  HouseRules: {
    NoSmoking: boolean;
    NoPets: boolean;
    NoParties: boolean;
    CheckInTime: string;
    CheckOutTime: string;
    PricePerNight: number;
    Cancellation: {
      Policy: {
        en: string;
        ar: string;
      };
      Refundable: boolean;
      DeadlineDays: number;
    };
  };
  Rooms: {
    Bedrooms: number;
    Bathrooms: number;
    LivingRooms: number;
    Kitchen: number;
    Balcony: number;
  };
  Facilities: {
    [key: string]: boolean;
  };
  images: string[]; 
  approved: boolean;  
  ownerId: string;  
  reviews: any[];  
}