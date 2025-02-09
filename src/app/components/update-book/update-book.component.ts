import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Impor Router di sini
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-update-book',
  templateUrl: './update-book.component.html',
  styleUrls: ['./update-book.component.css']
})
export class UpdateBookComponent implements OnInit {
  book: any = {}; // Properti untuk data buku yang sedang diedit
  newStock!: number; // Deklarasi newStock di sini

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private router: Router // Deklarasikan Router di konstruktor
  ) {}

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('id');
    if (!bookId) {
      alert('ID buku tidak ditemukan di URL.');
      return;
    }
  
    this.bookService.getBookById(+bookId).subscribe(
      (data) => {
        this.book = data;
        this.newStock = this.book.stok || 0; // Default stok ke 0 jika undefined
      },
      (error) => {
        console.error('Error fetching book data:', error);
        alert('Gagal mengambil detail buku.');
      }
    );
  }  
  
  updateBook(): void {
    if (!this.book.bookId) {
      alert('ID buku tidak ditemukan.');
      return;
    }
  
    this.book.stok = this.newStock;
    this.bookService.updateBook(this.book).subscribe(
      (response) => {
        alert('Buku berhasil diperbarui!');
        this.router.navigate(['/book-stock']);
      },
      (error) => {
        console.error('Error updating book:', error);
        alert('Gagal memperbarui buku.');
      }
    );
  }  

  cancel(): void {
    this.router.navigate(['/book-stock']);
  }
}
