# 🍜 Mie Hoog Restaurant Management System

> *Sistem manajemen resto lengkap dengan Backend API, Frontend Dashboard, dan WhatsApp Bot!*

## 📖 Overview

Mie Hoog adalah sistem manajemen restoran yang terdiri dari 3 komponen utama:

- **🔧 Backend API** - RESTful API dengan Node.js & Firebase
- **💻 Frontend Dashboard** - Web interface dengan Next.js & React  
- **📱 WhatsApp Bot** - Notifikasi otomatis ke customer

## 🏗️ Project Structure

```
mie-hoog/
├── back-end/          # Backend API (Node.js + Express + Firebase)
├── front-end/         # Frontend Dashboard (Next.js + React)
├── wa-bot/           # WhatsApp Bot (Node.js + Baileys)
└── README.md         # Panduan instalasi ini
```

## 🚀 Quick Start

### Prerequisites

Pastikan sudah terinstall:
- **Node.js** (v16 atau lebih baru)
- **npm** atau **yarn**
- **Firebase project** dengan Realtime Database
- **Git**

### 1️⃣ Clone Repository

```bash
git clone <repository-url>
cd mie-hoog
```

### 2️⃣ Setup Firebase

1. Buat Firebase project di [Firebase Console](https://console.firebase.google.com)
2. Enable **Realtime Database**
3. Generate **Service Account Key**:
   - Project Settings → Service Accounts
   - Generate new private key
   - Download JSON file

### 3️⃣ Install Backend API

```bash
cd back-end
npm install

# Setup Firebase credentials di utils/firebase.js
# Copy service account key ke utils/

# Set environment variables (optional)
echo "PORT=3000" > .env
echo "IMAGE_UPLOAD_URL=http://image.rpnza.my.id/upload" >> .env

# Start backend server
npm start
```

Backend akan jalan di `http://localhost:3000`

### 4️⃣ Install Frontend Dashboard

```bash
cd ../front-end
npm install

# Setup environment variables
echo "NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1" > .env.local
echo "NEXT_PUBLIC_IMAGE_URL=https://image.rpnza.my.id/get" >> .env.local
echo "NEXTAUTH_SECRET=your-secret-key" >> .env.local
echo "NEXTAUTH_URL=http://localhost:3001" >> .env.local

# Start development server
npm run dev
```

Frontend akan jalan di `http://localhost:3001`

### 5️⃣ Install WhatsApp Bot

```bash
cd ../wa-bot
npm install

# Copy Firebase service account key ke utils/accountKey.json
# Update databaseURL di app.js dengan Firebase Database URL

# (Optional) Tambahkan logo resto ke assets/logo.JPG

# Start WhatsApp bot
npm start
```

Scan QR code yang muncul dengan WhatsApp untuk login.

## 🔧 Configuration

### Firebase Database Structure

Buat struktur database di Firebase Console:

```
mie-hoog/
├── category/
├── menu/
├── order/
├── table/
├── transaction/
└── user/
```

### Default Admin User

Buat user admin pertama via Firebase Console atau API:

```json
{
  "name": "Administrator",
  "username": "admin",
  "password": "admin123",
  "level": "admin"
}
```

## 📱 Usage

### 🔐 Login ke Dashboard

1. Buka `http://localhost:3001`
2. Login dengan:
   - Username: `admin`
   - Password: `admin123`

### 📋 Flow Penggunaan

1. **Setup Menu & Kategori** (Admin)
   - Tambah kategori menu
   - Upload menu dengan gambar dan harga

2. **Kelola Meja** (Admin/Kasir)
   - Tambah nomor meja yang tersedia

3. **Proses Order** (Kasir)
   - Buat order baru untuk customer
   - Update status order: Pending → Cooking → Ready → Served

4. **Notifikasi WhatsApp** (Otomatis)
   - Bot kirim notifikasi ke customer saat order mulai dimasak

5. **Transaksi & Laporan** (Admin)
   - View history transaksi
   - Generate sales reports

## 🛠️ Development

### Start All Services

Buka 3 terminal terpisah:

```bash
# Terminal 1 - Backend
cd back-end && npm run dev

# Terminal 2 - Frontend  
cd front-end && npm run dev

# Terminal 3 - WhatsApp Bot
cd wa-bot && npm run dev
```

### Build untuk Production

```bash
# Backend
cd back-end && npm install --production

# Frontend
cd front-end && npm run build && npm start

# WhatsApp Bot
cd wa-bot && npm install --production && npm start
```

## 🚨 Troubleshooting

### Backend Issues
- Check Firebase credentials di `utils/firebase.js`
- Pastikan port 3000 tidak digunakan aplikasi lain
- Verify Firebase Database rules

### Frontend Issues
- Check `NEXT_PUBLIC_API_URL` di `.env.local`
- Clear browser cache jika ada hydration error
- Pastikan backend API sudah running

### WhatsApp Bot Issues
- Scan ulang QR code jika connection terputus
- Check Firebase service account key di `utils/accountKey.json`
- Pastikan format nomor telepon customer benar (08xxx → 628xxx)

## 🔗 API Endpoints

Backend API tersedia di `http://localhost:3000/api/v1/`:

- **Categories**: `/kategori/*`
- **Menu**: `/menu/*`
- **Orders**: `/order/*`
- **Tables**: `/table/*`
- **Transactions**: `/transaction/*`
- **Users**: `/user/*`

Lihat dokumentasi lengkap di `back-end/README.md`.

## 📊 Features

### ✅ Completed Features
- ✅ User authentication & authorization
- ✅ Menu management dengan image upload
- ✅ Order processing & status tracking
- ✅ Transaction history & reporting
- ✅ Table management
- ✅ WhatsApp notifications
- ✅ Responsive web interface

### 🚧 Planned Features
- 🔄 Print receipt functionality
- 🔄 Inventory management
- 🔄 Customer loyalty program
- 🔄 Multiple restaurant branches
- 🔄 Mobile app

## 🤝 Contributing

1. Fork repository ini
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

Project ini menggunakan MIT License.

## 👥 Support

Jika ada pertanyaan atau butuh bantuan:
- Create issue di GitHub repository
- Contact developer team

---

*Built with ❤️ for Indonesian Restaurant Industry*

**Happy coding! 🚀🍜**
