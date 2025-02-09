import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-peminjaman',
  templateUrl: './peminjaman.component.html',
  styleUrls: ['./peminjaman.component.css']
})
export class PeminjamanComponent {
  bookId: number = 0;
  jumlah: number = 1;
  userId: number = 0;  // Misalnya, inisialisasi dengan nilai default
  tanggalPinjam: string = '';  // Inisialisasi tanggal dalam format string
  tanggalKembali: string = ''; // Inisialisasi tanggal dalam format string


  constructor(
    private http: HttpClient, // Tambahkan HttpClient di sini
    private bookService: BookService,
    private authService: AuthService
  ) {}

  submitPeminjaman() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId'); // Ambil userId dari localStorage
  
    if (!token) {
      console.error('Token tidak ditemukan. Anda harus login terlebih dahulu.');
      alert('Silakan login terlebih dahulu!');
      return;
    }
  
    if (!userId) {
      console.error('UserId tidak ditemukan. Pastikan Anda sudah login.');
      alert('Silakan login ulang, userId tidak ditemukan!');
      return;
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const peminjamanData = {
      bookId: this.bookId,
      userId: parseInt(userId, 10), // Konversi userId menjadi angka
      jumlah: this.jumlah,
      tanggalPinjam: this.tanggalPinjam,
      tanggalKembali: this.tanggalKembali,
    };
  
    this.http.post('http://localhost:3000/api/peminjaman', peminjamanData, { headers })
      .subscribe({
        next: (response) => {
          console.log('Peminjaman berhasil:', response);
          alert('Peminjaman berhasil!');
        },
        error: (error) => {
          console.error('Error menambahkan peminjaman:', error);
          alert('Terjadi kesalahan, silakan coba lagi.');
        }
      });
  }
  
}
