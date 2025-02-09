const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Secret key untuk JWT
const SECRET_KEY = 'your-secret-key';  // Pastikan kunci rahasia konsisten

// Middleware untuk mengecek JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];  // Ambil token dari header

  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);  // Gunakan SECRET_KEY yang sama
    req.user = decoded;  // Menyimpan informasi pengguna dari token di req.user
    next();  // Lanjutkan ke middleware atau route handler berikutnya
  } catch (error) {
    console.error('Token verification failed:', error);  // Log error untuk debugging
    return res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken; //jgn dihapus

const checkRole = (role) => {
  return (req, res, next) => {
    // Memeriksa apakah user ada di dalam request dan memiliki role yang sesuai
    if (req.user && req.user.role === role) {
      return next();  // Jika role sesuai, lanjutkan ke handler berikutnya
    } else {
      return res.status(403).json({ message: 'Access denied' });  // Jika role tidak sesuai
    }
  };
};

// Endpoint Register
app.post("/api/register", (req, res) => {
  const { username, password, email, role, namaLengkap, nomorTelepon } = req.body;

  if (!username || !password || !email || !role || !namaLengkap || !nomorTelepon) {
    return res.status(400).json({ message: "Semua field diperlukan" });
  }

  db.query("SELECT * FROM pengguna WHERE username = ?", [username], (err, results) => {
    if (err) return res.status(500).json({ message: "Kesalahan saat memeriksa username" });
    if (results.length > 0) return res.status(400).json({ message: "Username sudah terdaftar" });

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ message: "Kesalahan saat mengenkripsi password" });

      const query = "INSERT INTO pengguna (username, password, email, role, namaLengkap, nomorTelepon) VALUES (?, ?, ?, ?, ?, ?)";
      db.query(query, [username, hashedPassword, email, role, namaLengkap, nomorTelepon], (err, result) => {
        if (err) return res.status(500).json({ message: "Kesalahan saat menyimpan pengguna" });

        const userId = result.insertId;
        const token = jwt.sign({ userId, username, role }, SECRET_KEY, { expiresIn: '1h' });

        res.status(201).json({
          message: "Pengguna berhasil didaftarkan",
          user: { userId, username, role },
          token
        });
      });
    });
  });
});

// Endpoint Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM pengguna WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).json({ message: 'Terjadi kesalahan saat memeriksa username' });
    if (results.length === 0) return res.status(400).json({ message: 'Username tidak ditemukan' });

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ message: 'Terjadi kesalahan saat login' });
      if (!isMatch) return res.status(400).json({ message: 'Password salah' });

      const token = jwt.sign({ userId: user.userId, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

      res.status(200).json({
        message: 'Login berhasil',
        user: { userId: user.userId, username: user.username, role: user.role },
        token
      });
    });
  });
});

// Endpoint untuk mendapatkan daftar buku
app.get("/api/book-list", verifyToken, checkRole("user"), (req, res) => {
  db.query("SELECT * FROM buku", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Endpoint untuk mendapatkan detail buku berdasarkan ID
app.get('/api/book-list/:id', verifyToken, checkRole("user"), (req, res) => {
  const bookId = req.params.id;

  // Query untuk mendapatkan detail buku berdasarkan ID
  const query = 'SELECT * FROM buku WHERE bookId = ?';

  db.query(query, [bookId], (err, results) => {
    if (err) {
      console.error('Error fetching book details:', err);
      return res.status(500).json({ message: 'Error fetching book details' });
    }
    
    // Jika buku ditemukan
    if (results.length > 0) {
      return res.json(results[0]);
    } else {
      return res.status(404).json({ message: 'Book not found' });
    }
  });
});

// Endpoint untuk menambah buku
app.post('/api/add-book', (req, res) => {
  const { judul, penulis, penerbit, tahun_terbit, kategori, stok, coverImageUrl, deskripsi } = req.body;

  const query = 'INSERT INTO buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, coverImageUrl, deskripsi) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [judul, penulis, penerbit, tahun_terbit, kategori, stok, coverImageUrl, deskripsi], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error inserting book', error: err });
    }
    res.status(200).json({ message: 'Book added successfully', data: results });
  });
});

// Menampilkan stok buku
app.get("/api/book-stock", verifyToken, checkRole("admin"), (req, res) => {
  const queryGetBooksStock = "SELECT * FROM buku;";
  db.query(queryGetBooksStock, (err, result) => {
    if (err) {
      console.error("Error query database:", err); // Log error
      return res.status(500).json({ message: "Error fetching book stock", error: err });
    }
    console.log("Data buku:", result); // Log hasil query
    res.status(200).json(result);
  });
});

//update
// Endpoint untuk mendapatkan data buku berdasarkan ID
app.get('/api/update-book/:id', verifyToken, checkRole("admin"), (req, res) => {
  const bookId = req.params.id;

  const queryGetBook = `SELECT * FROM buku WHERE bookId = ?`;
  db.query(queryGetBook, [bookId], (err, results) => {
    if (err) {
      console.error("Error fetching book data:", err);
      return res.status(500).json({ message: "Error fetching book data", error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Buku tidak ditemukan" });
    }

    res.status(200).json(results[0]); // Kirim data buku pertama
  });
});

// Endpoint untuk memperbarui data buku berdasarkan ID
app.put('/api/update-book/:id',  verifyToken, checkRole("admin"), (req, res) => {
  const bookId = req.params.id;
  const { judul, penulis, coverImageUrl, stok, penerbit, tahun_terbit, kategori, deskripsi } = req.body;

  // Validasi input untuk kolom baru
  if (!judul || !penulis || !coverImageUrl || stok === undefined || !penerbit || !tahun_terbit || !kategori || !deskripsi) {
    return res.status(400).json({ message: "Semua data harus diisi!" });
  }

  // Query untuk memperbarui buku
  const queryUpdateBook = `
    UPDATE buku 
    SET judul = ?, penulis = ?, coverImageUrl = ?, stok = ?, penerbit = ?, tahun_terbit = ?, kategori = ?, deskripsi = ? 
    WHERE bookId = ?
  `;
  
  db.query(queryUpdateBook, [judul, penulis, coverImageUrl, stok, penerbit, tahun_terbit, kategori, deskripsi, bookId], (err, result) => {
    if (err) {
      console.error("Error updating book:", err);
      return res.status(500).json({ message: "Error updating book", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Buku tidak ditemukan" });
    }

    res.status(200).json({ message: "Buku berhasil diperbarui!" });
  });
});

//untuk delete
app.delete('/api/delete-book/:id', verifyToken, checkRole("admin"), async (req, res) => {
  const bookId = req.params.id;
  console.log('bookId yang diterima:', bookId);  // Log bookId
  
  if (!bookId || isNaN(bookId)) {
    return res.status(400).json({ message: 'ID buku tidak valid' });
  }

  // Query untuk menghapus stok dan buku
  try {

    const deleteBookQuery = 'DELETE FROM buku WHERE bookId = ?';
    const [deleteBookResult] = await db.promise().query(deleteBookQuery, [bookId]);

    if (deleteBookResult.affectedRows === 0) {
      return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }

    res.status(200).json({ message: 'Buku dan stok berhasil dihapus' });
  } catch (error) {
    console.error('Gagal menghapus buku:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat menghapus buku' });
  }
});

app.post('/api/peminjaman', verifyToken, checkRole("user"), (req, res) => {
  const userId = req.user.id; // Ambil userId dari token
  const { bookId, jumlah, tanggalPinjam, tanggalKembali } = req.body;

  // Logika untuk menyimpan peminjaman ke database
  const query = `
    INSERT INTO peminjaman (bookId, userId, jumlah, tanggalPinjam, tanggalKembali)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(query, [bookId, userId, jumlah, tanggalPinjam, tanggalKembali], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Peminjaman berhasil ditambahkan' });
  });
});

// Fungsi untuk mengambil laporan harian (khusus untuk admin)
app.get("/api/laporan-harian", verifyToken, checkRole("admin"), (req, res) => {
  const today = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
  const query = `
    SELECT * FROM peminjaman
    WHERE DATE(tanggalPinjam) = ?`;

  db.query(query, [today], (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Gagal mengambil data peminjaman", error: err });
    res.json(results);
  });
});

// Fungsi untuk mengambil laporan bulanan (khusus untuk admin)
app.get("/api/laporan-bulanan", verifyToken, checkRole("admin"), (req, res) => {
  const month = new Date().getMonth() + 1; // Bulan saat ini (1 - 12)
  const year = new Date().getFullYear(); // Tahun saat ini
  const query = `
    SELECT * FROM peminjaman
    WHERE MONTH(tanggalPinjam) = ? AND YEAR(tanggalPinjam) = ?`;

  db.query(query, [month, year], (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Gagal mengambil data peminjaman", error: err });
    res.json(results);
  });
});

// Memulai server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
