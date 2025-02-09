export interface Peminjaman {
    id: number;
    userId: number;  // ID pengguna yang meminjam
    bookId: number;  // ID buku yang dipinjam
    tanggalPinjam: Date;  // Tanggal peminjaman
    tanggalKembali: Date;  // Tanggal pengembalian (bisa kosong jika belum dikembalikan)
  }
  