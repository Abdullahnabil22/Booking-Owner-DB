import { Routes } from '@angular/router';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { AddPropertyComponent } from './Components/add-property/add-property.component';
import { EditPropertyComponent } from './Components/edit-property/edit-property.component';
import { ReviewsComponent } from './Components/reviews/reviews.component';
import { MessagesComponent } from './Components/messages/messages.component';
import { LoginComponent } from './Components/login/login.component';
import { AddHotelComponent } from './Components/add-hotel/add-hotel.component';
import { AddApartmentComponent } from './Components/add-apartment/add-apartment.component';
import { MainlayoutComponent } from './Components/mainlayout/mainlayout.component';
import { userauthGuard } from './Guards/userauth.guard';
import { EditHotelComponent } from './Components/edit-Hotel/edit-hotel/edit-hotel.component';
import { AmenitiesComponent } from './Components/amenities/amenities.component';
import { AddRoomComponent } from './Components/add-room/add-room.component';
import { BookingListComponent } from './Components/booking-list/booking-list.component';
import { EditApartmentComponent } from './Components/edit-apartment/edit-apartment.component';

export const routes: Routes = [
  {
    path: '',
    component: MainlayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [userauthGuard],
      },
      {
        path: 'add-property',
        component: AddPropertyComponent,
        canActivate: [userauthGuard],
      },

      {
        path: 'add-property/hotel',
        component: AddHotelComponent,
        canActivate: [userauthGuard],
      },
      {
        path: 'add-property/amenities/:id',
        component: AmenitiesComponent,
        canActivate: [userauthGuard],
      },
      {
        path: 'add-property/room/:id',
        component: AddRoomComponent,
        canActivate: [userauthGuard],
      },
      {
        path: 'add-property/apartment',
        component: AddApartmentComponent,
        canActivate: [userauthGuard],
      },
      {
        path: 'edit-property',
        component: EditPropertyComponent,
        canActivate: [userauthGuard],
      },
      {
        path: 'reviews/:id',
        component: ReviewsComponent,
        canActivate: [userauthGuard],
      },
      {
        path: 'messages',
        component: MessagesComponent,
        canActivate: [userauthGuard],
      },
      {
        path: 'add-property/hotel/:id',
        component: AddHotelComponent,
        canActivate: [userauthGuard],
      },
      {
        path: 'edit-Hotel/:id',
        component: EditHotelComponent,
        canActivate: [userauthGuard],
      },
      {
        path: 'edit-Apartment/:id',
        component: EditApartmentComponent,
        canActivate: [userauthGuard],
      },
      {
        path: 'BookingList/:id',
        component: BookingListComponent,
        canActivate: [userauthGuard],
      },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/dashboard' },
];
