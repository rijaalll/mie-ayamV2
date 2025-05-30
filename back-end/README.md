# 🍜 Mie Hoog API - Dokumentasi Kece! 

Yo! Ini API buat sistem mie hoog yang super mantul! ✨

## 🚀 Base URL
```
http://localhost:3001/api/v1
```

## ⚡ Setup Gercep

1. Install dependencies dulu, bro:
```bash
npm install
```

2. Bikin file `.env` yang kece:
```
API_PORT=3001
```

3. Gas start servernya:
```bash
node index.js
```

Kalau udah running, bakal keluar pesan: `Server running at http://localhost:3001` 🎉

---

## 🎯 Endpoints Mantul

### 🔥 Test API Connection

#### GET /
Cek aja API lu hidup apa engga

**Response:**
```json
{
  "status": "OK",
  "message": {
    "version": "1.0.0", 
    "message": "API work cuy"
  }
}
```

Status: ✅ **200 OK** - API hidup dan sehat!

---

### 👥 User Management (Buat Ngatur User)

#### POST /user/add
Daftarin user baru nih

**Request Body:**
```json
{
  "name": "Joko Widodo",
  "username": "jokowi",
  "password": "password123",
  "level": "admin" // opsional, default: "user"
}
```

**Response Success (201):**
```json
{
  "message": "User added",
  "userId": "firebase_generated_key_ganteng"
}
```

**Response Gagal (409) - Username udah ada:**
```json
{
  "message": "Username already exists"
}
```

**Response Error (400) - Data kurang:**
```json
{
  "message": "Name, username, and password are required"
}
```

#### GET /user/get/:id
Ambil data user berdasarkan ID

**Contoh:** `GET /user/get/abc123`

**Response Success (200):**
```json
{
  "id": "abc123",
  "name": "Joko Widodo",
  "username": "jokowi",
  "password": "password123",
  "level": "admin", 
  "createdAt": 1640995200000
}
```

**Response Gagal (404):**
```json
{
  "message": "User not found"
}
```

#### POST /user/login  
Login user - yang paling penting nih!

**Request Body:**
```json
{
  "username": "jokowi",
  "password": "password123"
}
```

**Response Success (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "abc123",
    "name": "Joko Widodo", 
    "username": "jokowi",
    "password": "password123",
    "level": "admin",
    "createdAt": 1640995200000
  }
}
```

**Response Gagal (401):**
```json
{
  "message": "Invalid username or password"
}
```

---

### 🍲 Menu Management (Yang Paling Seru!)

#### POST /menu/add
Tambahin menu baru - **ADMIN ONLY** nih bos! 

**Content-Type:** `multipart/form-data`

**Form Data:**
- `menu_name`: "Mie Ayam Jumbo" 
- `menu_price`: "25000"
- `menu_des`: "Mie ayam porsi gede buat yang laper berat"
- `user_id`: "admin_user_id" (wajib admin!)
- `file`: [upload gambar menu yang kece]

**Response Success (201):**
```json
{
  "message": "Menu added successfully",
  "menu": {
    "id": "firebase_auto_key",
    "menu_id": "menu_001", 
    "menu_name": "Mie Ayam Jumbo",
    "menu_price": "25000",
    "menu_des": "Mie ayam porsi gede buat yang laper berat",
    "menu_img": "http://127.0.0.1:3001/api/v1/image/random123.jpg",
    "createdAt": 1640995200000
  }
}
```

**Response Ditolak (403) - Bukan admin:**
```json
{
  "message": "Access denied. Admin only."
}
```

#### GET /menu/all
Ambil semua menu yang ada - ini yang paling sering dipake!

**Response (200):**
```json
{
  "status": "OK",
  "all_menu": [
    {
      "id": "firebase_key1",
      "menu_id": "menu_001",
      "menu_name": "Mie Ayam Jumbo", 
      "menu_price": "25000",
      "menu_des": "Mie ayam porsi gede buat yang laper berat",
      "menu_img": "http://127.0.0.1:3001/api/v1/image/random123.jpg",
      "createdAt": 1640995200000
    },
    {
      "id": "firebase_key2", 
      "menu_id": "menu_002",
      "menu_name": "Mie Ayam Biasa",
      "menu_price": "15000", 
      "menu_des": "Mie ayam standar yang tetep enak",
      "menu_img": "http://127.0.0.1:3001/api/v1/image/random456.jpg",
      "createdAt": 1640995300000
    }
  ]
}
```

#### GET /menu/:id
Ambil satu menu aja berdasarkan `menu_id`

**Contoh:** `GET /menu/menu_001`

**Response Success (200):**
```json
{
  "id": "firebase_key1",
  "menu_id": "menu_001",
  "menu_name": "Mie Ayam Jumbo",
  "menu_price": "25000", 
  "menu_des": "Mie ayam porsi gede buat yang laper berat",
  "menu_img": "http://127.0.0.1:3001/api/v1/image/random123.jpg",
  "createdAt": 1640995200000
}
```

**Response Gagal (404):**
```json
{
  "message": "Menu not found"
}
```

#### POST /menu/delete
Hapus menu - **ADMIN ONLY** juga nih!

**Request Body:**
```json
{
  "id": "firebase_key_menu_yang_mau_dihapus",
  "user_id": "admin_user_id"
}
```

**Response Success (200):**
```json
{
  "message": "Menu deleted successfully"
}
```

**Response Ditolak (403):**
```json
{
  "message": "Access denied. Admin only."
}
```

#### POST /menu/update
Update menu yang udah ada - **ADMIN ONLY** tentunya!

**Content-Type:** `multipart/form-data`

**Form Data (semua opsional kecuali id dan user_id):**
- `id`: "firebase_key_menu" (wajib)
- `user_id`: "admin_user_id" (wajib)  
- `menu_name`: "Mie Ayam Super Jumbo" (opsional)
- `menu_price`: "30000" (opsional)
- `menu_des`: "Deskripsi baru yang kece" (opsional)
- `file`: [gambar baru kalau mau ganti] (opsional)

**Response Success (200):**
```json
{
  "message": "Menu updated successfully"
}
```

---

### 🖼️ Image Service (Buat Nampilin Gambar)

#### GET /image/:filename
Ambil file gambar menu

**Contoh:** `GET /image/random123.jpg`

**Response:** 
- ✅ File gambar langsung (kalau ada)
- ❌ Error 404 + JSON kalau gak ketemu

```json
{
  "message": "Image not found" 
}
```

---

## 🚨 Error Responses (Yang Sering Muncul)

**400 - Bad Request:**
```json
{
  "message": "Required field missing" // Ada field yang kurang
}
```

**401 - Unauthorized:**
```json
{
  "message": "Invalid username or password" // Login gagal
}
```

**403 - Forbidden:**
```json
{
  "message": "Access denied. Admin only." // Bukan admin tapi maksa
}
```

**404 - Not Found:**
```json
{
  "message": "Menu not found" // Data gak ketemu
}
```

**409 - Conflict:**
```json
{
  "message": "Username already exists" // Username udah dipake
}
```

**500 - Internal Server Error:**
```json
{
  "message": "Internal server error" // Server lagi error
}
```

---

## 👑 User Levels

- **`user`**: User biasa (default) - cuma bisa liat-liat aja
- **`admin`**: Admin kece - bisa CRUD menu sesuka hati

---

## 🎨 File Upload Info

- **Format gambar:** JPG, PNG, GIF (yang umum-umum)
- **Lokasi penyimpanan:** `assets/uploads/images/`
- **URL akses:** `http://127.0.0.1:3001/api/v1/image/{nama_file_random}`
- **Nama file:** Auto generate pake crypto biar unik

---

## 🗄️ Database Structure (Firebase Realtime Database)

```
mie-hoog/
├── user/ 
│   └── {firebase_key}/
│       ├── id: "firebase_key"
│       ├── name: "Nama Lengkap"
│       ├── username: "username_unik" 
│       ├── password: "password123"
│       ├── level: "user" atau "admin"
│       └── createdAt: 1640995200000
├── menu/
│   └── {firebase_key}/
│       ├── id: "firebase_key"
│       ├── menu_id: "menu_001" (auto increment)
│       ├── menu_name: "Nama Menu Kece"
│       ├── menu_price: "15000" (string)
│       ├── menu_des: "Deskripsi yang menarik"
│       ├── menu_img: "http://127.0.0.1:3001/api/v1/image/abc123.jpg"
│       └── createdAt: 1640995200000
└── order/
    └── {firebase_key}/
        ├── id: "firebase_key" 
        ├── order_day: "29" (tanggal)
        ├── order_month: "05" (bulan)
        ├── order_year: "2025" (tahun)
        ├── order_status: 1 (status pesanan)
        ├── order_total: 70000 (total harga)
        ├── table_number: 4 (nomor meja)
        ├── user_id: "firebase_user_key"
        └── order_list: {
            "{menu_firebase_key}": 2, // quantity menu
            "{menu_firebase_key}": 1
        }
```

### 📋 Order Status Codes:
- **0**: Pending (Menunggu konfirmasi)
- **1**: Confirmed (Dikonfirmasi) 
- **2**: Preparing (Sedang dimasak)
- **3**: Ready (Siap disajikan)
- **4**: Completed (Selesai)
- **5**: Cancelled (Dibatalkan)

---

## 💡 Tips Penggunaan

1. **Selalu login dulu** sebelum aksi yang butuh admin
2. **Simpan user_id** setelah login buat operasi selanjutnya  
3. **Menu_id otomatis** increment jadi gak usah pusing
4. **Upload gambar** pake form-data, bukan JSON
5. **Error 403** berarti lu bukan admin, jangan maksa! 😄

---

## 🎉 Penutup

API ini udah siap pakai buat aplikasi mie hoog yang mantul! Kalau ada bug atau mau request fitur baru, langsung aja kontak developer-nya ya! 

**Happy coding, bro! 🚀✨**
