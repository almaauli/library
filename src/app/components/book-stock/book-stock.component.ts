import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-stock',
  templateUrl: './book-stock.component.html',
  styleUrls: ['./book-stock.component.css']
})
export class BookStockComponent implements OnInit {
  private visibleActions: Set<number> = new Set();
  books: any[] = [];  // Tipe data disesuaikan untuk menerima response dari API

  constructor(private http: HttpClient, private bookService: BookService) {}

  ngOnInit(): void {
    this.getBooksStock();
    console.log('Books setelah getBooksStock:', this.books);  // Log data buku setelah load
  }
  

  // Function untuk mengambil data buku dan stok dari API
  getBooksStock(): void {
    this.bookService.getBookStock().subscribe(
      (data) => {
        this.books = data;
        console.log('Data buku yang diterima:', this.books);  // Debugging
        // Periksa apakah setiap buku memiliki bookId
        this.books.forEach(book => console.log('bookId:', book.bookId));
      },
      (error) => {
        console.error('Ada kesalahan saat mengambil data:', error);
      }
    );
  }  

 // Toggle fungsi untuk menunjukkan atau menyembunyikan tombol dropdown
 toggleActions(bookId: number): void {
  if (this.visibleActions.has(bookId)) {
    this.visibleActions.delete(bookId);
  } else {
    this.visibleActions.add(bookId);
  }
}

// Fungsi untuk memeriksa apakah dropdown untuk buku tertentu harus ditampilkan
isActionsVisible(bookId: number): boolean {
  return this.visibleActions.has(bookId);
}

  // Fungsi untuk menghapus buku berdasarkan ID
  onDeleteBook(bookId: number): void {
    console.log('ID Buku yang diterima dalam onDeleteBook:', bookId);  // Debugging
    if (!bookId || isNaN(bookId)) {
      console.error("ID buku tidak ditemukan atau tidak valid");
      return;
    }
  
    // Tampilkan dialog konfirmasi
    const isConfirmed = confirm("Apakah Anda yakin ingin menghapus buku ini?");
    if (!isConfirmed) {
      console.log("Penghapusan dibatalkan oleh pengguna.");
      return;
    }
  
    this.bookService.deleteBook(bookId).subscribe({
      next: () => {
        // Hapus buku dari daftar setelah sukses
        this.books = this.books.filter(book => book.bookId !== bookId);
        alert("Buku berhasil dihapus.");
      },
      error: err => {
        console.error("Gagal menghapus buku:", err);
        alert("Terjadi kesalahan saat menghapus buku. Silakan coba lagi.");
      }
    });
  }  
}
