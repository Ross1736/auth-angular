import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import {
  IFormUser,
  IPatchRecoveryPassword,
  IResponsePostRecoveryPassword,
  IResponsePostUser,
  IResponseVerifySession,
  IUser,
} from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl: string = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  postLogin(user: IFormUser) {
    return this.http.post<IResponsePostUser>(`${this.apiUrl}/auth/login`, user);
  }

  postRegister(user: IFormUser) {
    return this.http.post<IResponsePostUser>(
      `${this.apiUrl}/auth/register`,
      user
    );
  }

  postRecoveryPassword(email: string) {
    return this.http.post<IResponsePostRecoveryPassword>(
      `${this.apiUrl}/auth/recovery`,
      { email }
    );
  }

  patchRecoveryPassword(data: IPatchRecoveryPassword) {
    return this.http.patch<IResponsePostUser>(
      `${this.apiUrl}/auth/recovery`,
      data
    );
  }

  getVerifySession(token: string): Observable<IResponseVerifySession> {
    return this.http.get<IResponseVerifySession>(`${this.apiUrl}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Métodos locales

  onSaveUserData(user: IUser) {
    localStorage.setItem(environment.idAuthLocal, JSON.stringify(user));
  }

  getTokenSession() {
    try {
      const sessionLocal = localStorage.getItem(environment.idAuthLocal);
      const session: IUser | null = sessionLocal
        ? JSON.parse(sessionLocal)
        : null;

      return session?.token || null;
    } catch {
      return null;
    }
  }

  Logout() {
    localStorage.removeItem(environment.idAuthLocal);
  }
}
