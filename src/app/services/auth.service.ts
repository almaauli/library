import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';  // URL endpoint API
  private userId: number | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object, 
    private http: HttpClient
  ) {}

  // Fungsi login
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        if (response && response.token && response.user) {
          // Simpan token dan user di localStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        } else {
          throw new Error('Invalid response from server');
        }
      })
    );
  }

  // Fungsi logout
  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, {}).pipe(
      tap(response => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
    );
  }

  // Cek apakah user sudah login
  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  // Mendapatkan token dari localStorage
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  //// Fungsi untuk mendapatkan data yang memerlukan otorisasi token
  getProtectedData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/protected-endpoint`, {
      headers: this.getAuthHeaders()  // Pastikan token dimasukkan dalam header
    });
  }

  // Metode untuk mendapatkan header dengan token (untuk autentikasi API)
  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');  // Ambil token dari localStorage
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Metode untuk registrasi user
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  // Mendapatkan role user dari data yang tersimpan di localStorage
  getUserRole(): string {
    if (isPlatformBrowser(this.platformId)) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.role || '';
    }
    return '';
  }

  // Mendapatkan username dari localStorage
  getUsername(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.username || null;
    }
    return null;
  }

  // Mendapatkan ID pengguna dari localStorage
  getUserId(): number | null {
    if (isPlatformBrowser(this.platformId)) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.userId || null;
    }
    return null;
  }
}
