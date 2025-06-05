# 🍜 Mie Hoog WhatsApp Bot

> *Bot WhatsApp yang bikin customer happy dengan notifikasi order real-time!*

## 📖 Overview

Yo! Ini adalah WhatsApp Bot untuk Mie Hoog yang bakal ngasih notifikasi otomatis ke customer pas order mereka udah mulai dimasak. Bot ini connect ke Firebase Realtime Database dan bakal ngirim pesan WhatsApp yang keren banget dengan detail pesanan lengkap.

### ✨ Fitur Unggulan

- 🔔 **Auto Notification**: Kirim notifikasi otomatis pas order status berubah jadi "sedang dimasak"
- 🍽️ **Detail Order**: Tampilin semua detail pesanan dengan format yang clean
- 🖼️ **Logo Support**: Kirim logo resto bareng sama pesan (kalau ada)
- 🔄 **Real-time Sync**: Listen ke Firebase changes secara real-time
- 📱 **Easy Setup**: Tinggal scan QR code dan bot siap jalan

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **@whiskeysockets/baileys** - WhatsApp Web API
- **Firebase Admin SDK** - Realtime Database connection
- **QRCode Terminal** - Buat login via QR code

## 🚀 Getting Started

### Prerequisites

Pastiin lo udah punya:
- Node.js (minimal v14.0.0)
- Firebase project dengan Realtime Database
- Service account key dari Firebase

### Installation

1. **Clone repository ini**
   ```bash
   git clone <repository-url>
   cd wa-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Firebase credentials**
   - Masukin service account key Firebase lo ke `utils/accountKey.json`
   - Update `databaseURL` di `app.js` dengan URL Firebase Database lo

4. **Siapkan logo (opsional)**
   - Taruh logo resto di `assets/logo.JPG`
   - Kalau nggak ada, bot bakal kirim text doang

5. **Run the bot**
   ```bash
   npm start
   ```
   atau untuk development:
   ```bash
   npm run dev
   ```

6. **Scan QR Code**
   - QR code bakal muncul di terminal
   - Scan pake WhatsApp lo
   - Done! Bot udah ready to rock 🎸

## 📋 Database Structure

Bot ini expect struktur Firebase Database kayak gini:

```
mie-hoog/
├── menu/
│   └── [category]/
│       └── [menu-item]/
│           ├── id: "menu_id"
│           ├── menu_name: "Nama Menu"
│           └── menu_price: "price"
└── order/
    └── [order-id]/
        ├── id: "order_id"
        ├── cust_name: "Customer Name"
        ├── telephone: "08xxxxxxxxxx"
        ├── table_number: "table_number"
        ├── order_status: 2
        ├── order_total: total_price
        ├── order_day: "DD"
        ├── order_month: "MM"
        ├── order_year: "YYYY"
        └── order_list: {
            "menu_id": quantity
        }
```

## 🔧 How It Works

1. **Firebase Listener**: Bot listen ke perubahan di `mie-hoog/order`
2. **Status Check**: Kalau `order_status` berubah jadi `2` (sedang dimasak)
3. **Data Processing**: Ambil detail menu dari database
4. **Message Formatting**: Format pesan yang keren dengan emoji dan info lengkap
5. **WhatsApp Send**: Kirim ke nomor customer via WhatsApp

## 📱 Message Format

Pesan yang dikirim bakal kayak gini:

```
🍜 PESANAN ANDA SEDANG DIPROSES 🍜

📋 Detail Pesanan:
• ID Pesanan: ORD001
• Nama: John Doe
• Meja: 5
• Tanggal: 15/12/2024

🍽️ Menu yang Dipesan:
1. Mie Ayam Special
   Qty: 2 x Rp25.000
   Subtotal: Rp50.000

💰 Total: Rp50.000

⏰ Status: SEDANG DIMASAK
📍 Pesanan Anda sedang diproses di dapur. Harap menunggu ya!

Terima kasih telah memesan di Mie Hoog! 🙏
```

## 🎯 Configuration

### Phone Number Format
Bot automatically format nomor telepon:
- `081234567890` → `6281234567890@s.whatsapp.net`
- `0812-3456-7890` → `6281234567890@s.whatsapp.net`

### Firebase Config
Update config di `app.js`:
```javascript
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-project.firebaseio.com'
});
```

## 🐛 Troubleshooting

### Common Issues

1. **QR Code nggak muncul**
   - Pastiin internet connection stabil
   - Restart bot dengan `npm start`

2. **Firebase connection error**
   - Check service account key di `utils/accountKey.json`
   - Pastiin database URL udah bener

3. **Message nggak terkirim**
   - Check format nomor telepon customer
   - Pastiin WhatsApp Web masih connected

4. **Logo nggak kekirim**
   - Check file `assets/logo.JPG` exist
   - Pastiin format file supported (JPG/PNG)

## 📦 Dependencies

```json
{
  "@whiskeysockets/baileys": "^6.7.18",
  "firebase-admin": "^12.7.0", 
  "pino": "^9.7.0",
  "qrcode-terminal": "^0.12.0"
}
```

## 📄 License

Project ini pake MIT License. Check `LICENSE` file untuk detail lengkap.

## 📞 Support

Kalau ada masalah atau pertanyaan:
- Create issue di GitHub
- Contact developer: Rizal

---

*Made with ❤️ for Mie Hoog Restaurant*

**Happy coding! 🚀**
