import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = 'http://localhost:3000/api/book-list';
  private bookStockUrl = 'http://localhost:3000/api/book-stock'; // Endpoint untuk book-stock
  private updateBookUrl = 'http://localhost:3000/api/update-book'; // URL khusus untuk update-book


  constructor(private http: HttpClient) {}

  // Fungsi untuk mendapatkan headers dengan token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('Token yang dikirim:', token);  // Cek apakah token ada
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  
  // Mendapatkan daftar buku
  getBooks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getAuthHeaders()  // Kirim token di header
    }).pipe(
      catchError(error => {
        console.error('Ada kesalahan saat mengambil daftar buku:', error);
        throw error;
      })
    );
  }

  // Fungsi untuk mengambil data stok buku
  getBookStock(): Observable<any[]> {
    return this.http.get<any[]>(this.bookStockUrl, {
      headers: this.getAuthHeaders()  // Kirim token di header
    }).pipe(
      catchError(error => {
        console.error('Ada kesalahan saat mengambil stok buku:', error);
        throw error;
      })
    );
  }

  // Fungsi untuk menambah data peminjaman
  addPeminjaman(peminjamanData: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/peminjaman', peminjamanData, {
      headers: this.getAuthHeaders()  // Kirim token di header
    }).pipe(
      catchError(error => {
        console.error('Ada kesalahan saat menambah peminjaman:', error);
        throw error;
      })
    );
  }

  // Mendapatkan detail buku berdasarkan id (dengan nomor)
  getBookByIdNumber(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()  // Kirim token di header
    }).pipe(
      catchError(error => {
        console.error('Ada kesalahan saat mengambil detail buku:', error);
        throw error;
      })
    );
  }

  // Mendapatkan update buku berdasarkan id (dengan string)
  getBookById(bookId: number): Observable<Book> {
    const url = `${this.updateBookUrl}/${bookId}`; // Gunakan URL khusus update-book
    return this.http.get<Book>(url, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError(error => {
        console.error('Error fetching book data:', error);
        throw error;
      })
    );
  }

  // Fungsi untuk memperbarui buku (menggunakan update-book URL)
  updateBook(book: Book): Observable<any> {
    const url = `${this.updateBookUrl}/${book.bookId}`; // Gunakan URL khusus update-book
    return this.http.put<any>(url, book, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError(error => {
        console.error('Error updating book:', error);
        throw error;
      })
    );
  }
  
  // Fungsi untuk menghapus buku berdasarkan bookId
  deleteBook(bookId: number): Observable<any> {
    if (!bookId) {
      throw new Error("bookId tidak valid");
    }
    const url = `http://localhost:3000/api/delete-book/${bookId}`;
    return this.http.delete<any>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Gagal menghapus buku:', error);
        throw error;
      })
    );
  }  
  
  // Fungsi untuk menambahkan buku
  addBook(book: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/add-book', book, {
      headers: this.getAuthHeaders()  // Kirim token di header
    }).pipe(
      catchError(error => {
        console.error('Ada kesalahan saat menambah buku:', error);
        throw error;
      })
    );
  }

  // Mendapatkan data peminjaman
  getPeminjaman(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getAuthHeaders()  // Kirim token di header
    }).pipe(
      catchError(error => {
        console.error('Ada kesalahan saat mengambil data peminjaman:', error);
        throw error;
      })
    );
  }
}
