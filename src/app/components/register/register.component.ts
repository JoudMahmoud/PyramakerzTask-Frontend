import { Component } from '@angular/core';
import { UserRegister } from '../../_models/user-register';
import { UserAuthService } from '../../services/auth/user-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  userRegister: UserRegister = {
    UserName: '',
    Email: '',
    Password: '',
    confirmPassword: '',
    Gender: 'F',
    
    messageError: '',
    styleMessageError: false,
  };

  constructor(private authService: UserAuthService, private router: Router) {}

  Register() {
    console.log('Register called');
    this.authService
      .Register(
        this.userRegister.UserName,
        this.userRegister.Password,
        this.userRegister.confirmPassword,
        this.userRegister.Email,
        this.userRegister.Gender
      )
      .subscribe({
        next: (response) => {
          console.log('Response is ', response);
          this.router.navigate(['/login']);
        },

        error: (err) => {
          this.userRegister.styleMessageError = true;
          if (err.error?.error === 'Email already exists') {
            this.userRegister.messageError = 'Email is already being used.';
          } else if (err.error?.confirmPassword) {
            this.userRegister.messageError = err.error.confirmPassword;
          } else if (err.error?.password) {
            this.userRegister.messageError = err.error.password;
          } else {
            this.userRegister.messageError =
              'Registration failed. Please try again.';
          }
        },
        complete: () => {
          console.log(`Register process success`);
        },
      });
  }
}
