# 🍜 Mie Hoog Backend API

> *RESTful API yang canggih buat sistem manajemen resto Mie Hoog!*

## 📖 Overview

Ini adalah backend API untuk aplikasi Mie Hoog yang dibangun dengan Node.js dan Express. API ini handle semua operasi CRUD untuk menu, order, user management, kategori, meja, dan transaksi. Data disimpan di Firebase Realtime Database dengan struktur yang well-organized.

### ✨ Key Features

- 🔐 **User Authentication**: Login system untuk admin dan kasir
- 🍽️ **Menu Management**: CRUD operations dengan image upload
- 📋 **Order Processing**: Real-time order management system
- 💰 **Transaction Tracking**: Complete transaction history
- 🏷️ **Category System**: Organized menu categorization
- 🪑 **Table Management**: Restaurant table allocation
- 📤 **Image Upload**: External image hosting integration
- 🔥 **Firebase Integration**: Real-time database synchronization

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Firebase Admin SDK** - Database & authentication
- **Axios** - HTTP client for external services
- **Form-Data** - Multipart form handling
- **Multer/Express-FileUpload** - File upload middleware

## 🏗️ Project Structure

```
back-end/
├── routes/
│   └── v1/
│       ├── kategori/kategori.js    # Category management
│       ├── menu/menu.js            # Menu CRUD operations
│       ├── order/order.js          # Order processing
│       ├── table/table.js          # Table management
│       ├── transaction/transaction.js # Transaction history
│       └── user/user.js            # User authentication
└── utils/
    └── firebase.js                 # Firebase configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 atau lebih baru)
- Firebase project dengan Realtime Database
- External image hosting service (opsional)

### Installation

1. **Clone dan setup project**
   ```bash
   git clone <repository-url>
   cd back-end
   npm install
   ```

2. **Configure Firebase**
   - Setup Firebase Admin SDK credentials di `utils/firebase.js`
   - Pastikan database rules sudah sesuai

3. **Environment Setup**
   ```bash
   # Buat file .env (kalau diperlukan)
   PORT=3000
   IMAGE_UPLOAD_URL=http://image.rpnza.my.id/upload
   ```

4. **Run the server**
   ```bash
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### 🏷️ Category Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/kategori/all` | Get all categories |
| POST | `/kategori/add` | Add new category |
| DELETE | `/kategori/:id` | Delete category |

**Add Category Example:**
```json
POST /kategori/add
{
  "name": "Mie Ayam"
}
```

### 🍽️ Menu Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/menu/all` | Get all menus |
| GET | `/menu/:id` | Get menu by ID |
| POST | `/menu/add` | Add new menu (with image) |
| POST | `/menu/update` | Update menu |
| POST | `/menu/delete` | Delete menu |

**Add Menu Example:**
```json
POST /menu/add
Content-Type: multipart/form-data

{
  "menu_name": "Mie Ayam Special",
  "menu_price": "25000",
  "menu_des": "Mie ayam dengan topping lengkap",
  "category": "Mie Ayam",
  "user_id": "admin_user_id",
  "file": [image_file]
}
```

### 📋 Order Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/order/all` | Get all orders |
| GET | `/order/id/:id` | Get order by ID |
| GET | `/order/customer/:name` | Get orders by customer |
| POST | `/order/add` | Create new order |
| POST | `/order/update` | Update order status |
| POST | `/order/delete` | Delete order |

**Create Order Example:**
```json
POST /order/add
{
  "cust_name": "John Doe",
  "table_number": "5",
  "order_status": 1,
  "order_list": {
    "menu_001": 2,
    "menu_002": 1
  }
}
```

### 🪑 Table Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/table/all` | Get all tables |
| GET | `/table/:id` | Get table by ID |
| POST | `/table/add` | Add new table |
| PUT | `/table/:id` | Update table |
| DELETE | `/table/:id` | Delete table |

### 💰 Transaction Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/transaction/all` | Get all transactions |
| GET | `/transaction/id/:id` | Get transaction by ID |
| GET | `/transaction/customer/:name` | Get by customer |
| GET | `/transaction/date/:day-:month-:year` | Get by date |
| POST | `/transaction/add` | Create transaction |
| POST | `/transaction/delete` | Delete transaction |

**Create Transaction Example:**
```json
POST /transaction/add
{
  "cust_name": "John Doe",
  "order_total": 50000,
  "order_menu": [
    {
      "nama": "Mie Ayam Special",
      "harga": 25000,
      "jumlah": 2,
      "menu_img": "https://image.url/menu.jpg"
    }
  ]
}
```

### 👤 User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/all` | Get all users |
| GET | `/user/get/:id` | Get user by ID |
| POST | `/user/add` | Add new user |
| POST | `/user/login` | User authentication |
| POST | `/user/update` | Update user |
| POST | `/user/delete` | Delete user |

**Login Example:**
```json
POST /user/login
{
  "username": "admin",
  "password": "password123"
}
```

## 🗄️ Database Structure

### Firebase Realtime Database Schema

```
mie-hoog/
├── category/
│   └── [auto-id]/
│       └── name: "Category Name"
├── menu/
│   └── [category-name]/
│       └── [auto-id]/
│           ├── id: "firebase-key"
│           ├── menu_id: "menu_001"
│           ├── menu_name: "Menu Name"
│           ├── menu_price: "price"
│           ├── menu_des: "description"
│           ├── menu_img: "image_url"
│           ├── category: "category_name"
│           └── createdAt: timestamp
├── order/
│   └── [auto-id]/
│       ├── id: "MH-[key]-[customer]"
│       ├── cust_name: "Customer Name"
│       ├── table_number: "table_number"
│       ├── order_day: "DD"
│       ├── order_month: "MM"
│       ├── order_year: "YYYY"
│       ├── order_status: status_number
│       ├── order_total: total_price
│       ├── order_list: { "menu_id": quantity }
│       └── createdAt: timestamp
├── table/
│   └── [auto-id]/
│       └── nomor: "table_number"
├── transaction/
│   └── [auto-id]/
│       ├── id: "TXN-[key]-[customer]"
│       ├── cust_name: "Customer Name"
│       ├── trans_day: "DD"
│       ├── trans_month: "MM"
│       ├── trans_year: "YYYY"
│       ├── trans_hour: "HH"
│       ├── trans_minute: "MM"
│       ├── trans_second: "SS"
│       ├── order_total: total_price
│       ├── order_menu: [menu_array]
│       └── createdAt: timestamp
└── user/
    └── [auto-id]/
        ├── id: "firebase-key"
        ├── name: "Full Name"
        ├── username: "username"
        ├── password: "password"
        ├── level: "admin|kasir"
        └── createdAt: timestamp
```

## 🔐 Authentication & Authorization

### User Levels
- **Admin**: Full access ke semua endpoints
- **Kasir**: Limited access untuk operasional

### Protected Endpoints
- Menu: Add, Update, Delete (Admin only)
- User: All operations (Admin access required)
- Order: All operations (Admin/Kasir)
- Transaction: All operations (Admin/Kasir)

## 🖼️ Image Upload System

API ini integrate dengan external image hosting service:

```javascript
// Upload endpoint
POST http://image.rpnza.my.id/upload

// Access uploaded image
GET https://image.rpnza.my.id/get/{filename}
```

### Supported Formats
- JPG, JPEG, PNG
- Max file size: sesuai konfigurasi server

## 📊 Order Status Codes

| Status | Description |
|--------|-------------|
| 1 | Pending/Baru masuk |
| 2 | Sedang dimasak |
| 3 | Siap disajikan |
| 4 | Selesai |
| 5 | Dibatalkan |

## 🔧 Error Handling

API ini return consistent error responses:

```json
{
  "message": "Error description",
  "status": "error"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## 🚨 Troubleshooting

### Common Issues

1. **Firebase Connection Error**
   - Check service account credentials
   - Verify database URL dan rules

2. **Image Upload Failed**
   - Check external image service availability
   - Verify file format dan size

3. **Authentication Failed**
   - Pastiin user level sesuai (admin/kasir)
   - Check username/password accuracy

4. **Order Total Calculation Wrong**
   - Verify menu prices di database
   - Check order_list format

## 🔄 Integration dengan WhatsApp Bot

API ini terintegrasi dengan WhatsApp Bot untuk notifikasi:
- Order status changes trigger WhatsApp notifications
- Bot listen ke Firebase changes secara real-time
- Automatic message formatting dengan order details

## 📈 Performance Tips

- Use Firebase indexing untuk query yang sering dipakai
- Implement caching untuk menu data
- Optimize image sizes sebelum upload
- Monitor database read/write operations

### Code Style
- Use consistent indentation (2 spaces)
- Follow RESTful API conventions
- Add proper error handling
- Include meaningful comments

## 📄 License

Project ini menggunakan MIT License.

---

*Built with ❤️ for Mie Hoog Restaurant Management System*

**Ready to serve delicious APIs! 🚀**
