export interface Payment {
    status: string;
    date: Date;
    method: string;
    amount: number;
    coin: string;
    payment_id: string;
}

export interface Commission {
    rate: number;
    amount: number;
}

export interface Booking {
    _id: string;
    payment: Payment;
    commission: Commission;
    check_in_date: Date; // تغيير إلى Date
    check_out_date: Date; // تغيير إلى Date
    booking_date: Date; // تغيير إلى Date
    userID: string; // يجب أن يكون من نوع ObjectId
    host_id: string; // يجب أن يكون من نوع ObjectId
    email: string;
    members: number;
    numberOfNights: number;
    numberOfRooms: number;
    status: string;
    createdAt: Date; // تغيير إلى Date
    updatedAt: Date; // تغيير إلى Date
    room_id: string[]; // إضافة room_id كـ مصفوفة من ObjectId
}