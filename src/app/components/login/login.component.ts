import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        // Log respons dari server untuk debugging
        console.log("Response dari server:", response);
  
        const user = response?.user;
        const token = response?.token;
  
        if (!user || !token) {
          this.errorMessage = 'Login gagal: Data user atau token tidak ditemukan.';
          console.error(this.errorMessage);
          return;
        }
  
        // Simpan token dan data user ke localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
  
        console.log("Token tersimpan:", token);
        console.log("User data tersimpan:", user);
  
        // Navigasi sesuai dengan role
        const userRole = user.role;
        console.log("Role pengguna:", userRole);
  
        if (userRole === 'admin') {
          this.router.navigate(['/book-stock']); // Admin ke stok buku
        } else if (userRole === 'user') {
          this.router.navigate(['/book-list']); // User ke daftar buku
        } else {
          this.router.navigate(['/forbidden']); // Role tidak dikenal
        }
      },
      error: (err) => {
        // Tangani error saat login
        console.error("Error login:", err);
        this.errorMessage = 'Username atau password salah. Silakan coba lagi.';
      }
    });
  }
  
}
