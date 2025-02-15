import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  private isLoggedSubject: BehaviorSubject<boolean>;
  private url: string = `${environment.apiUrl}`;
  constructor(private httpClient: HttpClient) {
    this.isLoggedSubject = new BehaviorSubject<boolean>(false);
  }
  GetToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  Register(
    userName: string,
    password: string,
    confirmPassword: string,
    email: string,
    gender: string
  ): Observable<any> {
    const registerData = { userName, password, confirmPassword, email, gender };
    return this.httpClient.post<any>(
      `${this.url}/api/Account/register`,
      registerData
    );
  }

  Login(email: string, password: string, rememberMe: boolean): Observable<any> {
    const loginData = { email, password, rememberMe };
    return this.httpClient
      .post<any>(`${this.url}/api/Account/login`, loginData)
      .pipe(
        map((response) => {
          const userToken = response.token;

          if (userToken) {
            if (rememberMe) {
              localStorage.setItem('token', userToken);
            } else {
              sessionStorage.setItem('token', userToken);
            }
            this.isLoggedSubject.next(true);
          }
        }),
        catchError((err) => {
          console.error('Login error: ', err);
          return throwError(
            () => new Error('Login failed. Please check your credentials.')
          );
        })
      );
  }

  Logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.isLoggedSubject.next(false);
  }

  get isUserLogged(): boolean {
    return localStorage.getItem('token') ? true : false;
  }

  getLoggedStatus(): Observable<boolean> {
    return this.isLoggedSubject.asObservable();
  }
}
