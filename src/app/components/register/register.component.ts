import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Sesuaikan path untuk AuthService

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  email: string = '';
  namaLengkap: string = '';
  nomorTelepon: string = '';
  role: string = 'user'; // Role otomatis set ke 'user'
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    // Pastikan semua field terisi
    if (!this.username || !this.password || !this.email || !this.namaLengkap || !this.nomorTelepon) {
      this.errorMessage = 'Semua field harus diisi.';
      return;
    }

    const userData = {
      username: this.username,
      password: this.password,
      email: this.email,
      role: this.role,
      namaLengkap: this.namaLengkap,
      nomorTelepon: this.nomorTelepon
    };

    // Menggunakan AuthService untuk registrasi
    this.authService.register(userData).subscribe(
      response => {
        // Navigasi ke halaman login setelah sukses registrasi
        this.router.navigate(['/login']);
      },
      error => {
        // Menampilkan error jika registrasi gagal
        this.errorMessage = 'Registrasi gagal. Periksa kembali data yang dimasukkan.';
      }
    );
  }
}
