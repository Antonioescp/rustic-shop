import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';

import { environment } from '../environments/environment';
import { LoginRequest } from './auth/login/login-request';
import { LoginResponse } from './auth/login/login-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey: string = "token";

  private _authStatus = new Subject<boolean>();

  public get authStatus(): Observable<boolean> {
    return this._authStatus.asObservable();
  }

  public set updatedAuthStatus(newValue: boolean) {
    this._authStatus.next(newValue);
  }

  constructor(
    protected http: HttpClient
  ) { }

  public get isAuthenticated(): boolean {
    return this.token !== null;
  }

  public get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  login(item: LoginRequest): Observable<LoginResponse> {
    var url = environment.baseUrl + "api/Users/auth/login";
    return this.http.post<LoginResponse>(url, item)
      .pipe(tap(loginResponse => {
        if (loginResponse.success && loginResponse.token) {
          localStorage.setItem(this.tokenKey, loginResponse.token);
          this.updatedAuthStatus = true;
        }
      }));
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.updatedAuthStatus = false;
  }

  init() {
    if (this.isAuthenticated) {
      this.updatedAuthStatus = true;
    }
  }
}
