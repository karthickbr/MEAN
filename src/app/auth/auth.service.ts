import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string;
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  constructor(public http: HttpClient) { }

  getToken() {

     return this.token;
  }

  getIsAuth() {
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
    this.http.post<{token: string}>('http://localhost:3000/api/user/login', authdata).subscribe(response => {
      // console.log(response);
      const token = response.token;
      this.token = token;
      if (token) {
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
      }

    });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
  }

}
