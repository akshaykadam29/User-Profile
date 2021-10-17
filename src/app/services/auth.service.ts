import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from './../../environments/environment';

import { User } from '../models/user.model';

const BACKEND_URL = environment.apiUrl + "users/";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private tokenTimer: NodeJS.Timer;
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }

  getToken(){
    // console.log(this.token);
    return this.token;
  }

  getUserId(){
    return localStorage.getItem('userId');
  }

  getUserProfile(id: string){
    return this.http.get<{ message: string, profileData: any }>( BACKEND_URL + id);
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  // Signup user
  addUser(name: string, email: string, contact: any, profilePic: File, password: string){
    const userData = new FormData();
    userData.append('name', name),
    userData.append('email', email),
    userData.append('contact', contact),
    userData.append('profilePic', profilePic),
    userData.append('password', password)

    this.http.post<{ message: string }>(BACKEND_URL + 'signup' , userData)
      .subscribe((userData) => {
        this.toastr.success(userData.message);
        this.router.navigate(['/auth/signin']);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  // Signin user
  loginUser(email: string, password: string){
    const userData = { email: email, password: password };
    this.http.post<{ token: string, expiresIn: number, userId: string }>(BACKEND_URL + 'login', userData)
      .subscribe(response => {
        console.log(response);
        const userId = response.userId;
        const token = response.token;
        this.token = token;
        if(token){
          const expiresInDuration = response.expiresIn;

          // token expiration timer
          this.setAuthTimer(expiresInDuration);

          this.isAuthenticated = true;
          this.authStatusListener.next(true);

          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, userId);
          console.log(expirationDate);

          // Navigate user
          this.router.navigate(['/myProfile']);

        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  // Edit User
  updateUser(id: string, name: string, email: string, contact: string, profilePic: File | string){
    let userData: User | FormData;
    // console.log(typeof profilePic);
    if(typeof profilePic === 'object'){
      userData = new FormData();
      userData.append('id', id);
      userData.append('name', name);
      userData.append('email', email);
      userData.append('contact', contact);
      userData.append('profilePic', profilePic);
      // console.log(userData);
    } else {
      userData = {
        id: id,
        name: name,
        email: email,
        contact: contact,
        profilePic: profilePic
      }
      // console.log(userData);
    }
    this.http.put<{ message: string, updatedUser: any }>(BACKEND_URL + 'signup' + id, userData)
      .subscribe(response => {
        this.toastr.success(response.message);
        this.router.navigate(['/myProfile']);
      })
  }

  autoAuthUser(){
    const authInformation = this.getAuthData();
    if(!authInformation){
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    console.log(expiresIn/1000);
    if(expiresIn > 0){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
      this.router.url;
    }
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/auth/signin']);
    this.toastr.success('Logged out successful!');
  }

  private setAuthTimer(duration: number){
    console.log("setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string){
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData(){
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if(!token || !expirationDate){
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }

}
