const mysql = require('mysql2');  

// Membuat koneksi ke database MySQL
const db = mysql.createConnection({
  host: 'localhost',      
  user: 'root',           
  password: '',           
  database: 'perpustakaan' 
});

// Mengecek koneksi
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database');
});

// Mengekspos koneksi untuk digunakan di file lain
module.exports = db;
