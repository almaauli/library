export interface Book {
  bookId: number;
  judul: string;
  penulis: string;
  penerbit?: string;
  tahun_terbit?: number;
  kategori?: string;
  stok: number;
  coverImageUrl: string;
  deskripsi?: string;
}
