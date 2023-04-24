import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';

import { environment } from '../environments/environment';
import { LoginRequest } from './auth/login/login-request';
import { LoginResponse } from './auth/login/login-response';
import PasswordResetRequest from './auth/password-reset-request/password-reset-request';
import PasswordResetData from './auth/password-reset/password-reset-data';
import RequestAccountUnlockRequest from './auth/request-account-unlock/request-account-unlock-request';
import UnlockAccountRequest from './auth/unlock-account/UnlockAccountRequest';

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

  init() {
    if (this.isAuthenticated) {
      this.updatedAuthStatus = true;
    }
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

  requestPasswordReset(body: PasswordResetRequest): Observable<HttpResponse<Response>> {
    const url = `${environment.apiBaseUrl}${environment.requestResetPasswordEndpoint}`;
    return this.http.post<Response>(
      url,
      body,
      {
        observe: 'response'
      }
    );
  }

  resetPassword(data: PasswordResetData): Observable<HttpResponse<Response>> {
    const url = `${environment.apiBaseUrl}${environment.passworResetEndpoint}`;
    return this.http.post<Response>(
      url,
      data,
      {
        observe: 'response',
      }
    );
  }

  requestAccountUnlock(data: RequestAccountUnlockRequest): Observable<HttpResponse<Response>> {
    const url = `${environment.apiBaseUrl}${environment.requestAccountUnlockEndpoint}`;
    return this.http.post<Response>(
      url,
      data,
      {
        observe: 'response'
      }
    );
  }

  unlockAccount(data: UnlockAccountRequest): Observable<HttpResponse<Response>> {
    const url = `${environment.apiBaseUrl}${environment.unlockAccountEndpoint}`;
    return this.http.post<Response>(
      url,
      data,
      {
        observe: 'response'
      }
    );
  }
}
