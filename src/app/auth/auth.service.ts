import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string;
  private isAuthenticated = false;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  constructor(public http: HttpClient, public router: Router) { }

  getToken() {

     return this.token;
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
     // console.log(response);
     });
   }

  login(email: string, password: string) {
   //  const authdata: AuthData = {email, password};
    const authdata = {email, password};
    this.http.post<{token: string, expiresIn: number}>('http://localhost:3000/api/user/login', authdata).subscribe(response => {
      // console.log(response);
      const token = response.token;
      this.token = token;

      if (token) {
        const expiresInDuration =  response.expiresIn;

        this.tokenTimer = setTimeout(() => {
          this.logout();
        }, expiresInDuration * 1000);

        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.router.navigate(['/']);
      }

    });
  }

  logout() {
    this.token = null;
    clearTimeout(this.tokenTimer);
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
  }

}
