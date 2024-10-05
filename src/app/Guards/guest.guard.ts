import { CanActivateFn } from '@angular/router';
import { UserService } from '../Services/user/user.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const guestGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  userService
    .getUserDetails(localStorage.getItem('token')!)
    .subscribe((token) => {
      if (token) {
        router.navigate(['/dashboard']);
      }
      return true;
    });
  return false;
};
