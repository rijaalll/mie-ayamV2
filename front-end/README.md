# 🍜 Mie Hoog Frontend

> *Modern & Responsive Restaurant Management System built with Next.js!*

## 📖 Overview

Frontend aplikasi Mie Hoog yang dibangun dengan Next.js dan React. Interface yang user-friendly untuk managing menu, orders, transaksi, dan operasional resto secara real-time. Terintegrasi seamlessly dengan Mie Hoog Backend API untuk pengalaman yang smooth dan responsive.

### ✨ Key Features

- 🎨 **Modern UI/UX**: Clean and intuitive interface with Tailwind CSS
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, dan mobile
- ⚡ **Real-time Updates**: Live order tracking dan menu management
- 🔐 **Role-based Access**: Different interfaces for admin dan kasir
- 🍽️ **Menu Management**: Easy CRUD operations dengan image preview
- 📋 **Order Processing**: Streamlined order workflow management
- 💰 **Transaction Dashboard**: Comprehensive sales reporting
- 🪑 **Table Management**: Visual table allocation system
- 🖼️ **Image Upload**: Drag & drop image upload functionality
- 🌙 **Dark/Light Mode**: Toggle between themes (opsional)

## 🛠️ Tech Stack

- **Next.js 14** - React framework dengan App Router
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client untuk API calls
- **React Hook Form** - Form handling dan validation
- **React Query/SWR** - Data fetching dan caching
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Elegant notifications
- **Next/Image** - Optimized image handling

## 🏗️ Project Structure

```
front-end/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── admin/
│   │   │   ├── menu/
│   │   │   ├── kategori/
│   │   │   ├── user/
│   │   │   └── reports/
│   │   ├── kasir/
│   │   │   ├── order/
│   │   │   ├── transaction/
│   │   │   └── table/
│   │   └── layout.jsx
│   ├── api/
│   ├── globals.css
│   ├── layout.jsx
│   └── page.jsx
├── components/
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   ├── Table.jsx
│   │   └── Form/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   ├── forms/
│   │   ├── MenuForm.jsx
│   │   ├── OrderForm.jsx
│   │   └── UserForm.jsx
│   └── charts/
│       ├── SalesChart.jsx
│       └── OrderChart.jsx
├── lib/
│   ├── api.js              # API client configuration
│   ├── auth.js             # Authentication utilities
│   ├── utils.js            # Helper functions
│   └── validations.js      # Form validation schemas
├── hooks/
│   ├── useAuth.js
│   ├── useMenu.js
│   ├── useOrder.js
│   └── useTransaction.js
├── contexts/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
└── public/
    ├── images/
    └── icons/
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 atau lebih baru)
- npm atau yarn
- Mie Hoog Backend API running

### Installation

1. **Clone dan setup project**
   ```bash
   git clone <repository-url>
   cd front-end
   npm install
   ```

2. **Environment Setup**
   ```bash
   # Buat file .env.local
   NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
   NEXT_PUBLIC_IMAGE_URL=https://image.rpnza.my.id/get
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3001
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Build untuk production**
   ```bash
   npm run build
   npm start
   ```

## 📱 Pages & Features

### 🔐 Authentication
- **Login Page**: Secure authentication dengan role detection
- **Password Reset**: Forgot password functionality
- **Protected Routes**: Automatic redirection berdasarkan user level

### 👑 Admin Dashboard
- **Menu Management**: 
  - Add/Edit/Delete menu items
  - Image upload dengan preview
  - Category assignment
  - Bulk operations
- **Category Management**: CRUD operations untuk kategori menu
- **User Management**: Manage kasir accounts dan permissions
- **Sales Reports**: Comprehensive analytics dan charts
- **System Settings**: Configuration dan preferences

### 👨‍💼 Kasir Interface
- **Order Management**:
  - Create new orders dengan menu selection
  - Real-time order tracking
  - Status updates (Pending → Cooking → Ready → Served)
  - Print receipts
- **Transaction History**: View dan search past transactions
- **Table Management**: Visual table status dan allocation
- **Customer Management**: Track customer orders dan preferences

### 📊 Dashboard Features
- **Real-time Metrics**: Live sales data dan order counts
- **Interactive Charts**: Sales trends, popular items, hourly sales
- **Quick Actions**: Frequently used operations dalam easy access
- **Notifications**: Real-time alerts untuk new orders dan updates

## 🎨 UI Components

### Core Components
```jsx
// Button component dengan variants
<Button variant="primary" size="lg" onClick={handleClick}>
  Add Menu
</Button>

// Card component untuk layout
<Card title="Order Summary" action={<Button>Print</Button>}>
  <OrderDetails />
</Card>

// Table component dengan sorting dan pagination
<Table 
  data={menuData} 
  columns={columns}
  searchable
  sortable
  pagination
/>
```

### Form Components
```jsx
// MenuForm dengan validation
<MenuForm 
  onSubmit={handleSubmit}
  initialData={editData}
  categories={categories}
/>

// OrderForm dengan item selection
<OrderForm 
  onSubmit={createOrder}
  menuItems={menuItems}
  tables={tables}
/>
```

## 🔄 State Management

### React Query untuk Server State
```jsx
// Custom hooks untuk data fetching
const { data: menus, isLoading } = useMenus();
const { data: orders } = useOrders();
const { mutate: createOrder } = useCreateOrder();
```

### Context untuk Global State
```jsx
// Auth context
const { user, login, logout } = useAuth();

// Theme context
const { theme, toggleTheme } = useTheme();
```

## 🎯 API Integration

### API Client Configuration
```javascript
// lib/api.js
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatic token attachment
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Data Fetching Patterns
```jsx
// SWR untuk real-time data
const { data, error, mutate } = useSWR('/order/all', fetcher, {
  refreshInterval: 5000, // Refresh every 5 seconds
});

// React Query untuk complex operations
const { mutate: updateOrder } = useMutation(updateOrderAPI, {
  onSuccess: () => {
    queryClient.invalidateQueries(['orders']);
    toast.success('Order updated successfully!');
  },
});
```

## 🎨 Styling dengan Tailwind CSS

### Design System
```css
/* Custom color palette */
:root {
  --color-primary: #f97316;     /* Orange */
  --color-secondary: #0ea5e9;   /* Blue */
  --color-success: #22c55e;     /* Green */
  --color-warning: #eab308;     /* Yellow */
  --color-danger: #ef4444;      /* Red */
}
```

### Component Styling
```jsx
// Consistent styling patterns
const buttonVariants = {
  primary: "bg-orange-500 text-white hover:bg-orange-600",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  success: "bg-green-500 text-white hover:bg-green-600",
};
```

## 📱 Responsive Design

### Breakpoint Strategy
- **Mobile First**: Base styles untuk mobile
- **Tablet (md)**: 768px dan ke atas
- **Desktop (lg)**: 1024px dan ke atas
- **Large Desktop (xl)**: 1280px dan ke atas

### Layout Examples
```jsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {menuItems.map(item => <MenuCard key={item.id} {...item} />)}
</div>

// Responsive navigation
<nav className="hidden md:flex md:space-x-4">
  <NavLink href="/menu">Menu</NavLink>
  <NavLink href="/orders">Orders</NavLink>
</nav>
```

## 🔧 Performance Optimization

### Next.js Optimizations
- **Image Optimization**: Next/Image untuk automatic optimization
- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Dynamic imports untuk heavy components
- **Caching**: Static generation dimana memungkinkan

### Bundle Analysis
```bash
# Analyze bundle size
npm run analyze

# Lighthouse performance testing
npm run lighthouse
```

## 🧪 Testing (Opsional)

### Testing Setup
```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

### Test Examples
```jsx
// Component testing
test('renders menu card correctly', () => {
  render(<MenuCard {...mockMenuData} />);
  expect(screen.getByText('Mie Ayam Special')).toBeInTheDocument();
});

// API testing
test('creates order successfully', async () => {
  const orderData = { cust_name: 'John', table_number: '5' };
  const result = await createOrder(orderData);
  expect(result.status).toBe('success');
});
```

## 🚀 Deployment

### Build Commands
```bash
# Production build
npm run build

# Start production server
npm start

# Export static files (jika diperlukan)
npm run export
```

### Deployment Platforms
- **Vercel**: Recommended untuk Next.js projects
- **Netlify**: Static hosting dengan serverless functions
- **Railway**: Full-stack deployment
- **DigitalOcean**: VPS deployment

### Environment Variables
```bash
# Production environment
NEXT_PUBLIC_API_URL=https://api.miehoog.com/api/v1
NEXT_PUBLIC_IMAGE_URL=https://image.rpnza.my.id/get
NEXTAUTH_SECRET=production-secret
NEXTAUTH_URL=https://miehoog.com
```

## 🔧 Troubleshooting

### Common Issues

1. **Hydration Error**
   ```jsx
   // Use dynamic import untuk components dengan browser-only features
   const DynamicComponent = dynamic(() => import('./Component'), {
     ssr: false
   });
   ```

2. **API Connection Error**
   - Check NEXT_PUBLIC_API_URL di .env.local
   - Verify backend server is running
   - Check CORS settings di backend

3. **Image Upload Issues**
   - Verify file size limits
   - Check supported formats
   - Ensure proper error handling

4. **Authentication Problems**
   - Clear browser cookies dan localStorage
   - Check token expiration
   - Verify user roles dan permissions

## 📊 Performance Metrics

### Core Web Vitals Targets
- **First Contentful Paint**: < 1.8s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### Optimization Techniques
- Image lazy loading dan optimization
- Component code splitting
- API response caching
- Bundle size monitoring

## 🤝 Contributing

### Development Workflow
1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Submit Pull Request

### Code Style Guidelines
- Use Prettier untuk code formatting
- Follow React/Next.js best practices
- Write meaningful component names
- Add proper TypeScript types (jika menggunakan TS)
- Include proper error boundaries

### Component Structure
```jsx
// Consistent component structure
const MenuCard = ({ menu, onEdit, onDelete }) => {
  // Hooks di atas
  const [isEditing, setIsEditing] = useState(false);
  
  // Handler functions
  const handleEdit = () => setIsEditing(true);
  
  // Render
  return (
    <Card>
      {/* Component JSX */}
    </Card>
  );
};

export default MenuCard;
```

## 👥 Contributors

Aplikasi ini dikembangkan oleh:

- **[Your Name](https://github.com/yourusername)** - Full Stack Developer
- **[Fanza](https://github.com/fanzausername)** - Full Stack Developer

## 📄 License

Project ini menggunakan MIT License - lihat file [LICENSE](LICENSE) untuk details.

---

## 🔗 Related Links

- [Backend Repository](link-to-backend-repo)
- [API Documentation](link-to-api-docs)
- [Design System](link-to-design-system)
- [Deployment Guide](link-to-deployment-guide)

---

*Built with ❤️ menggunakan Next.js untuk Mie Hoog Restaurant Management System*

**Ready to serve amazing user experiences! 🚀✨**
