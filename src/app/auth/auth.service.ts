import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string;
  private userId: string;
  private isAuthenticated = false;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  constructor(public http: HttpClient, public router: Router) { }

  getToken() {

     return this.token;
  }

  getUserId() {
    return this.userId;
  }
  getIsAuth() {  // it is for to update the status of auth in post list after login that redirect to postlist component.
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(name: string, email: string, password: string) {

    const authdata: AuthData = {name, email, password};
    this.http.post('http://localhost:3000/api/user/signup', authdata ).subscribe(response => {
      console.log(response);
     });
   }

  login(email: string, password: string) {
   //  const authdata: AuthData = {email, password};
    const authdata = {email, password};
    this.http.post<{token: string, expiresIn: number, userId: string}>('http://localhost:3000/api/user/login', authdata)
    .subscribe(response => {
      // console.log(response);
      const token = response.token;
      this.token = token;

      if (token) {
        const expiresInDuration =  response.expiresIn;
        this.userId = response.userId;
        this.setAuthTimer(expiresInDuration);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        console.log(expirationDate);
        this.saveAuthData(token, expirationDate, this.userId );
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.router.navigate(['/']);
      }

    });
  }

    autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
       this.token = authInformation.token;
       this.isAuthenticated = true;
       this.userId = authInformation.userId;
       this.setAuthTimer(expiresIn / 1000);
       this.authStatusListener.next(true);
    }

  }

   private setAuthTimer(duration: number) {
      console.log('setting Timer', duration);
      this.tokenTimer = setTimeout(() => {
        this.logout();
      }, duration * 1000);
    }

  logout() {
    this.token = null;
    clearTimeout(this.tokenTimer);
    this.isAuthenticated = false;
    this.userId = null;
    this.clearAuthData();
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }

    return {
      token,
      userId,
      expirationDate: new Date(expirationDate)

    };
  }
}
