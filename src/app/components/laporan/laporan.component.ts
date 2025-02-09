import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-laporan',
  templateUrl: './laporan.component.html',
  styleUrls: ['./laporan.component.css']
})
export class LaporanComponent implements OnInit {
  laporanHari: any[] = [];
  laporanBulan: any[] = [];

  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit(): void {
    this.getLaporanHari();
    this.getLaporanBulan();
  }

  // Mendapatkan laporan hari ini
  getLaporanHari(): void {
    this.http.get<any[]>('http://localhost:3000/api/laporan-harian', {
      withCredentials: true
    }).subscribe(
      (response) => {
        this.laporanHari = response;
      },
      (error) => {
        console.error('Error mengambil laporan hari ini:', error);
      }
    );
  }

  // Mendapatkan laporan bulan ini
  getLaporanBulan(): void {
    this.http.get<any[]>('http://localhost:3000/api/laporan-bulanan', {
      withCredentials: true
    }).subscribe(
      (response) => {
        this.laporanBulan = response;
      },
      (error) => {
        console.error('Error mengambil laporan bulan ini:', error);
      }
    );
  }  
}
