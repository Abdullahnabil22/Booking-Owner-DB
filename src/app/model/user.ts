export interface User {
    _id?: string;
    userName?: string;
    firstName?: string; 
    lastName?: string; 
    email: string; 
    nationality?: string; 
    numberOfMembers?: number;
    phoneNumber?: string; 
    
    role?: 'admin' | 'user' | 'owner'; 
    active?: boolean;
    createdAt?: Date; 
    updatedAt?: Date; 
  }