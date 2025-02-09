import { Component, OnInit } from '@angular/core';
import { BookService } from './book.service';

@Component({
  selector: 'app-peminjaman',
  templateUrl: './peminjaman.component.html',
  styleUrls: ['./peminjaman.component.css'],
})
export class PeminjamanComponent implements OnInit {
  peminjamanList: any[] = [];
  newPeminjaman: any = {
    userId: null,
    bookId: null,
    tanggalPinjam: new Date(),
    tanggalKembali: null,
  };

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    // Mendapatkan daftar peminjaman jika perlu
  }

  tambahPeminjaman(): void {
    this.bookService.addPeminjaman(this.newPeminjaman).subscribe(
      (response) => {
        console.log(response);
        this.peminjamanList.push({ ...this.newPeminjaman });
        // Reset form setelah peminjaman ditambahkan
        this.newPeminjaman = {
          userId: null,
          bookId: null,
          tanggalPinjam: new Date(),
          tanggalKembali: null,
        };
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}
