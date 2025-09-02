import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { ToastService } from '@shared/modules/toast/toast.service';
import { BaseResponse } from '@core/models';
import { UserModel } from '@core/models/user.model';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  authService.checkToken().subscribe({
    next: (res: BaseResponse<UserModel>) => {
      if (res.result) {
        return true;
      }

      toast.showError('Sessão expirada');
      router.navigate(['/sign-in']);

      return false;
    },
    error: (res: HttpErrorResponse) => {
      if (res.status === HttpStatusCode.Unauthorized) {
        toast.showError('Sessão expirada');
        router.navigate(['/sign-in']);

        return false;
      }

      toast.showError(res.error.message);
      return false;
    }
  });

  return true;
};
