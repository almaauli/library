import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent {
  // Properti buku
  judul: string = '';
  penulis: string = '';
  penerbit: string = '';
  tahun_terbit: number | null = null;
  kategori: string = '';
  stok: number = 0;
  coverImageUrl: string = '';
  deskripsi: string = '';
  message: string = '';
  
  // Variabel untuk melacak status pengiriman
  isSubmitting = false;

  constructor(private http: HttpClient, private router: Router) {}

  onAddBook() {
    if (this.isSubmitting) return;  // Cegah pengiriman ganda
    this.isSubmitting = true;  // Menandai pengiriman sedang berlangsung
  
    // Data buku yang akan dikirim
    const newBook = {
      judul: this.judul,
      penulis: this.penulis,
      penerbit: this.penerbit,
      tahun_terbit: this.tahun_terbit,
      kategori: this.kategori,
      stok: this.stok,
      coverImageUrl: this.coverImageUrl,
      deskripsi: this.deskripsi
    };
  
    // Ambil token dari localStorage
    const token = localStorage.getItem('token'); 
    if (!token) {
      console.error("Token tidak ditemukan. Silakan login kembali.");
      this.message = "Autentikasi gagal. Silakan login kembali.";
      this.isSubmitting = false;  // Reset status pengiriman
      return;
    }
  
    // Header dengan Authorization
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    // Kirim data ke server
    this.http.post('http://localhost:3000/api/add-book', newBook, { headers })
      .subscribe({
        next: (response) => {
          console.log('Buku berhasil ditambahkan:', response);
          this.message = 'Data berhasil ditambahkan!';
          this.resetForm();
  
          // Navigasi setelah 2 detik
          setTimeout(() => {
            this.message = '';
            this.router.navigate(['/book-stock']); // Pastikan route benar
          }, 2000);
        },
        error: (err) => {
          console.error('Error menambahkan buku:', err);
          this.message = err.error?.message || `Terjadi kesalahan: ${err.message || err}`;
        },
        complete: () => {
          this.isSubmitting = false;  // Mengubah status kembali setelah proses selesai
        }
      });
  }  

  // Reset form ke keadaan awal
  resetForm() {
    this.judul = '';
    this.penulis = '';
    this.penerbit = '';
    this.tahun_terbit = null;
    this.kategori = '';
    this.stok = 0;
    this.coverImageUrl = '';
    this.deskripsi = '';
  }

  cancel(): void {
    this.router.navigate(['/book-stock']);
  }
}
