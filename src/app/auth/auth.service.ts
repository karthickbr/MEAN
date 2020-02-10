import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public http: HttpClient) { }


  createUser(name: string, email: string, password: string) {

    const authdata: AuthData = {name, email, password};
    this.http.post('http://localhost:3000/api/user/signup', authdata ).subscribe(response => {
     console.log(response);
     });
   }


}
