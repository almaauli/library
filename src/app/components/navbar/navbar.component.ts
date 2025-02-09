import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  showNavbar: boolean = true;
  username: string | undefined;
  userRole: string | null = null;  // Menyimpan role pengguna

  constructor(
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Cek apakah kode berjalan di browser sebelum mengambil username dan role
    if (isPlatformBrowser(this.platformId)) {
      this.username = this.authService.getUsername() || undefined;
      this.userRole = this.authService.getUserRole();  // Ambil role pengguna
    }

    // Dengarkan perubahan navigasi rute
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = event.urlAfterRedirects;
        this.showNavbar = !(currentRoute.startsWith('/login') || currentRoute.startsWith('/register'));
      }
    });
  }

  confirmLogout() {
    // Tampilkan konfirmasi kepada pengguna
    const confirmation = window.confirm('Apakah Anda yakin ingin logout?');
    
    if (confirmation) {
      // Jika pengguna mengonfirmasi, lakukan proses logout
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
      }
  
      // Arahkan ke halaman login
      this.router.navigate(['/login']).then(() => {
        window.location.reload(); // Refresh halaman setelah logout
      });
    }
  }
  
}
