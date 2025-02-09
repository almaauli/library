import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LaporanService {

  private apiUrl = 'http://localhost:3000/api/laporan'; // Ganti dengan URL API yang sesuai

  constructor(private http: HttpClient) { }

  // Metode untuk mendapatkan laporan hari ini
  getLaporanHariIni(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/hari-ini`);
  }

  // Metode untuk mendapatkan laporan bulan ini
  getLaporanBulanIni(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bulan-ini`);
  }
}
