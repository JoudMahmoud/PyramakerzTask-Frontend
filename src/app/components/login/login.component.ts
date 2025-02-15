import { Component } from '@angular/core';
import { UserLogin } from '../../_models/user-login';
import { UserAuthService } from '../../services/auth/user-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  userLogin: UserLogin = {
    Email: '',
    Password: '',
    RememberMe: false,

    messageError: '',
    styleMessageError: false

  };
  constructor(private authService:UserAuthService, private router :Router){}
  Login() {
    console.log('Remember me : ', this.userLogin.RememberMe);
    this.authService.Login(this.userLogin.Email, this.userLogin.Password, this.userLogin.RememberMe).subscribe({
      next: (respone) => {
        if (respone && respone.token) {
          if (this.userLogin.RememberMe) {
            localStorage.setItem('token', respone.token);
          } else {
            sessionStorage.setItem('token', respone.token);
          }
        }
        alert(`Hi ${this.userLogin.Email}`);
        this.router.navigate(['/register']);
      }, error: (err) => {
        console.error('Login error:', err);
        this.userLogin.styleMessageError = true;
      }, complete: () => {
        console.log('Login process success');
      }
    });

}
}
