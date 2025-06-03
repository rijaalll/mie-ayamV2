# 🍜 Mie Hoog API - Dokumentasi Kece Abis! 

Yo! Ini API buat sistem mie hoog yang super mantul dan udah di-upgrade! ✨

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

### 👥 User Management (Admin & Kasir Only!)

#### POST /user/add
Daftarin user baru nih - **cuma admin & kasir doang yang bisa!**

**Request Body:**
```json
{
  "name": "Joko Widodo",
  "username": "jokowi",
  "password": "password123",
  "level": "admin" // wajib! pilih: "admin" atau "kasir"
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
  "message": "Name, username, password, and level are required"
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

#### GET /user/all
Ambil semua data user (admin & kasir aja)

**Response Success (200):**
```json
{
  "status": "OK",
  "users": [
    {
      "id": "abc123",
      "name": "Joko Widodo",
      "username": "jokowi",
      "password": "password123",
      "level": "admin",
      "createdAt": 1640995200000
    }
  ]
}
```

#### POST /user/login  
Login user - **cuma admin & kasir yang bisa masuk!**

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
  "message": "Invalid username or password, or insufficient privileges"
}
```

#### POST /user/update
Update data user

**Request Body:**
```json
{
  "id": "abc123",
  "updates": {
    "name": "Joko Widodo Baru",
    "level": "kasir"
  }
}
```

#### POST /user/delete
Hapus user

**Request Body:**
```json
{
  "id": "abc123"
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
- `category`: "Mie" (wajib, harus sesuai kategori yang ada!)
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
    "menu_img": "https://image.rpnza.my.id/get/random123.jpg",
    "category": "Mie",
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
      "menu_img": "https://image.rpnza.my.id/get/random123.jpg",
      "category": "Mie",
      "createdAt": 1640995200000
    }
  ]
}
```

#### GET /menu/:id
Ambil satu menu aja berdasarkan `menu_id`

**Contoh:** `GET /menu/menu_001`

#### POST /menu/delete
Hapus menu - **ADMIN ONLY** juga nih!

**Request Body:**
```json
{
  "id": "firebase_key_menu_yang_mau_dihapus",
  "user_id": "admin_user_id"
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

---

### 🛒 Order Management (Buat Customer Pesan!)

#### POST /order/add
Bikin pesanan baru - **semua orang bisa pesen nih!**

**Request Body:**
```json
{
  "cust_name": "Andi Keren",
  "table_number": 5,
  "order_status": 0,
  "order_list": {
    "firebase_menu_key1": 2,
    "firebase_menu_key2": 1
  }
}
```

**Response Success (201):**
```json
{
  "message": "Order created successfully",
  "order": {
    "id": "MH-firebase_key-Andi Keren",
    "cust_name": "Andi Keren",
    "table_number": 5,
    "order_day": "03",
    "order_month": "06", 
    "order_year": "2025",
    "order_status": 0,
    "order_total": 65000,
    "order_list": {
      "firebase_menu_key1": 2,
      "firebase_menu_key2": 1
    },
    "createdAt": 1640995200000
  }
}
```

#### GET /order/all
Ambil semua pesanan

#### GET /order/id/:id
Ambil pesanan berdasarkan ID

**Contoh:** `GET /order/id/MH-abc123-Andi`

#### GET /order/customer/:cust_name
Ambil pesanan berdasarkan nama customer

**Contoh:** `GET /order/customer/Andi%20Keren`

#### POST /order/update
Update status pesanan

**Request Body:**
```json
{
  "id": "MH-abc123-Andi",
  "updates": {
    "order_status": 2
  }
}
```

#### POST /order/delete
Hapus pesanan

**Request Body:**
```json
{
  "id": "MH-abc123-Andi"
}
```

---

### 💰 Transaction Management (Riwayat Transaksi Kece!)

#### POST /transaction/add
Catat transaksi yang udah selesai

**Request Body:**
```json
{
  "cust_name": "Andi Keren",
  "order_total": 65000,
  "order_menu": [
    {
      "nama": "Mie Ayam Jumbo",
      "harga": 25000,
      "jumlah": 2,
      "menu_img": "https://image.rpnza.my.id/get/abc123.jpg"
    },
    {
      "nama": "Es Teh Manis",
      "harga": 8000,
      "jumlah": 2,
      "menu_img": "https://image.rpnza.my.id/get/def456.jpg"
    }
  ]
}
```

**Response Success (201):**
```json
{
  "message": "Transaction created successfully",
  "transaction": {
    "id": "TXN-firebase_key-Andi Keren",
    "cust_name": "Andi Keren",
    "trans_day": "03",
    "trans_month": "06",
    "trans_year": "2025",
    "trans_hour": "14",
    "trans_minute": "30",
    "trans_second": "45",
    "order_total": 65000,
    "order_menu": [...],
    "createdAt": 1640995200000
  }
}
```

#### GET /transaction/all
Ambil semua transaksi

#### GET /transaction/id/:id
Ambil transaksi berdasarkan ID

#### GET /transaction/customer/:cust_name
Ambil transaksi berdasarkan nama customer

#### GET /transaction/date/:day-:month-:year
Ambil transaksi berdasarkan tanggal

**Contoh:** `GET /transaction/date/03-06-2025`

#### POST /transaction/delete
Hapus transaksi

---

### 🏷️ Category Management (Kategori Menu!)

#### GET /kategori/all
Ambil semua kategori menu

**Response (200):**
```json
{
  "status": "OK",
  "kategori": [
    {
      "id": "firebase_key1",
      "name": "Mie"
    },
    {
      "id": "firebase_key2", 
      "name": "Minuman"
    }
  ]
}
```

#### POST /kategori/add
Tambahin kategori baru

**Request Body:**
```json
{
  "name": "Snack"
}
```

#### DELETE /kategori/:id
Hapus kategori

**Contoh:** `DELETE /kategori/firebase_key1`

---

### 🪑 Table Management (Ngatur Meja!)

#### GET /table/all
Ambil semua data meja

**Response (200):**
```json
{
  "status": "OK",
  "tables": [
    {
      "id": "firebase_key1",
      "nomor": 1
    },
    {
      "id": "firebase_key2",
      "nomor": 2
    }
  ]
}
```

#### GET /table/:id
Ambil data meja berdasarkan ID

#### POST /table/add
Tambahin meja baru

**Request Body:**
```json
{
  "nomor": 15
}
```

#### PUT /table/:id
Update nomor meja

**Request Body:**
```json
{
  "nomor": 16
}
```

#### DELETE /table/:id
Hapus meja

---

## 🚨 Error Responses (Yang Sering Muncul)

**400 - Bad Request:**
```json
{
  "message": "Required field missing"
}
```

**401 - Unauthorized:**
```json
{
  "message": "Invalid username or password, or insufficient privileges"
}
```

**403 - Forbidden:**
```json
{
  "message": "Access denied. Admin only."
}
```

**404 - Not Found:**
```json
{
  "message": "Data not found"
}
```

**409 - Conflict:**
```json
{
  "message": "Username already exists"
}
```

**500 - Internal Server Error:**
```json
{
  "message": "Internal server error"
}
```

---

## 👑 User Levels (Update!)

- **`admin`**: Superuser - bisa ngapa-ngapain sesuka hati
- **`kasir`**: Staff kasir - bisa login & akses tertentu

⚠️ **PENTING:** Level `user` biasa udah dihapus! Sekarang cuma admin & kasir doang yang bisa login ke sistem.

---

## 🎨 File Upload Info

- **Format gambar:** JPG, PNG, GIF
- **Upload service:** External server di `https://image.rpnza.my.id`  
- **URL akses:** `https://image.rpnza.my.id/get/{filename}`
- **Auto resize & optimize:** Udah otomatis kece!

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
│       ├── level: "admin" atau "kasir" (cuma 2 ini doang!)
│       └── createdAt: 1640995200000
├── menu/
│   └── {category_name}/
│       └── {firebase_key}/
│           ├── id: "firebase_key"
│           ├── menu_id: "menu_001" (auto increment)
│           ├── menu_name: "Nama Menu Kece"
│           ├── menu_price: "15000" (string)
│           ├── menu_des: "Deskripsi yang menarik"
│           ├── menu_img: "https://image.rpnza.my.id/get/abc123.jpg"
│           ├── category: "Mie"
│           └── createdAt: 1640995200000
├── category/
│   └── {firebase_key}/
│       └── name: "Mie"
├── table/
│   └── {firebase_key}/
│       └── nomor: 1
├── order/
│   └── {firebase_key}/
│       ├── id: "MH-firebase_key-customer_name" 
│       ├── cust_name: "Nama Customer"
│       ├── order_day: "29" (tanggal)
│       ├── order_month: "05" (bulan)
│       ├── order_year: "2025" (tahun)
│       ├── order_status: 1 (status pesanan)
│       ├── order_total: 70000 (total harga)
│       ├── table_number: 4 (nomor meja)
│       ├── order_list: {
│       │   "{menu_firebase_key}": 2, // quantity menu
│       │   "{menu_firebase_key}": 1
│       │ }
│       └── createdAt: 1640995200000
└── transaction/
    └── {firebase_key}/
        ├── id: "TXN-firebase_key-customer_name"
        ├── cust_name: "Nama Customer"
        ├── trans_day: "03"
        ├── trans_month: "06"
        ├── trans_year: "2025"
        ├── trans_hour: "14"
        ├── trans_minute: "30"
        ├── trans_second: "45"
        ├── order_total: 65000
        ├── order_menu: [
        │   {
        │     "nama": "Menu Name",
        │     "harga": 25000,
        │     "jumlah": 2,
        │     "menu_img": "https://..."
        │   }
        │ ]
        └── createdAt: 1640995200000
```

### 📋 Order Status Codes:
- **0**: Pending (Menunggu konfirmasi)
- **1**: Confirmed (Dikonfirmasi) 
- **2**: Preparing (Sedang dimasak)
- **3**: Ready (Siap disajikan)
- **4**: Completed (Selesai)
- **5**: Cancelled (Dibatalkan)

---

## 🔥 Fitur Baru yang Kece!

### ✨ Yang Baru Ditambah:
1. **Transaction System** - Catat semua transaksi yang udah selesai
2. **Category Management** - Kelompok menu jadi lebih rapih
3. **Table Management** - Ngatur meja restoran
4. **External Image Upload** - Upload gambar ke server terpisah, lebih cepet!
5. **Custom Order ID** - ID pesanan jadi unik: `MH-key-customer`
6. **Custom Transaction ID** - ID transaksi: `TXN-key-customer`
7. **Date Filter** - Cari transaksi berdasarkan tanggal
8. **User Level Restriction** - Cuma admin & kasir yang bisa login

### 🛠️ Yang Diperbaiki:
- Menu sekarang dikelompok berdasarkan kategori di database
- Upload gambar pake external service yang lebih handal
- Auto-generate menu ID yang lebih konsisten
- Validasi data yang lebih ketat
- Error handling yang lebih detail

---

## 💡 Tips Penggunaan Update!

1. **Login wajib punya level admin/kasir** - customer gak bisa login!
2. **Bikin kategori dulu** sebelum tambahin menu
3. **Menu ID otomatis** jadi gak usah pusing
4. **Order ID custom** biar gampang lacak pesanan
5. **Transaction buat laporan** - catat yang udah selesai aja
6. **Table management** - atur nomor meja sesuai resto lu
7. **Image upload external** - gambar lebih cepet load!

---

## 🚀 Flow Penggunaan Recommended:

### Admin Setup:
1. `POST /user/add` - Daftarin admin/kasir
2. `POST /kategori/add` - Bikin kategori menu
3. `POST /table/add` - Setup meja-meja
4. `POST /menu/add` - Tambahin menu per kategori

### Customer Flow:
1. `GET /menu/all` - Liat semua menu
2. `POST /order/add` - Pesan makanan
3. `GET /order/id/:id` - Cek status pesanan

### Kitchen/Kasir Flow:
1. `POST /user/login` - Login dulu
2. `GET /order/all` - Liat semua pesanan
3. `POST /order/update` - Update status masak
4. `POST /transaction/add` - Catat transaksi selesai

### Reporting:
1. `GET /transaction/all` - Laporan semua transaksi
2. `GET /transaction/date/dd-mm-yyyy` - Laporan harian
3. `GET /transaction/customer/:name` - Riwayat customer

---

## 🎉 Penutup

API ini udah makin mantul dengan fitur-fitur baru yang bikin sistem mie hoog lu jadi lebih profesional! Semua udah siap pakai buat aplikasi yang lebih canggih.

**Selamat ngoding, bro! Semoga sistem lu makin kece! 🚀✨**

> **Note:** Jangan lupa backup database secara berkala ya! Data customer itu penting banget! 💾