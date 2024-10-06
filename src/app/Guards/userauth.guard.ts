import { CanActivateFn } from '@angular/router';
import { LoginService } from '../Services/login/login.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
export const userauthGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  let router = inject(Router);

  if (loginService.isUserLoggedIn) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
