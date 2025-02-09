import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';  // Import Router
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: any[] = [];

  constructor(
    private bookService: BookService,
    private router: Router  // Inject Router
  ) {}

  ngOnInit(): void {
    this.bookService.getBooks().subscribe((data) => {
      this.books = data;
    });
  }

  // Fungsi untuk menuju halaman detail buku
  goToBookDetail(bookId: number): void {
    this.router.navigate(['/book-detail', bookId]);
  }  
}
