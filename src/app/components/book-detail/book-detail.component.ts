import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Tambahkan Router
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  book: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Tambahkan Router di constructor
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    const bookIdString = this.route.snapshot.paramMap.get('id');
    if (bookIdString !== null) {
      const bookId = Number(bookIdString); // Mengubah ID menjadi number
  
      // Panggil API berdasarkan ID yang diterima
      this.bookService.getBookByIdNumber(bookId).subscribe(
        (data) => {
          this.book = data; // Menyimpan data buku ke dalam book
        },
        (error) => {
          console.error('Error fetching book data:', error);
        }
      );
    }
  }

  // Fungsi untuk mengarahkan kembali ke daftar buku
  cancel(): void {
    this.router.navigate(['/book-list']);
  }

  goToPinjam() {
    this.router.navigate(['/peminjaman']); // Ganti dengan rute yang sesuai untuk halaman peminjaman
  }
}
