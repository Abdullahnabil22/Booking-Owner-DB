import { Routes } from '@angular/router';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { AddPropertyComponent } from './Components/add-property/add-property.component';
import { EditPropertyComponent } from './Components/edit-property/edit-property.component';
import { ReviewsComponent } from './Components/reviews/reviews.component';
import { MessagesComponent } from './Components/messages/messages.component';
import { LoginComponent } from './Components/login/login.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add-property', component: AddPropertyComponent },
  { path: 'edit-property', component: EditPropertyComponent },
  { path: 'reviews', component: ReviewsComponent },
  { path: 'messages', component: MessagesComponent },
  { path: 'login', component: LoginComponent },
];
