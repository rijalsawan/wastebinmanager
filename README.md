# WasteBin - Smart Waste Management System

A modern, full-stack waste management system built with **Next.js 16**, featuring real-time IoT sensor simulation, analytics dashboards, and role-based access control.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-316192)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC)

## ✨ Features

### 🔐 Authentication & Authorization
- **NextAuth v5** with JWT sessions
- Role-based access control (Admin & User roles)
- Secure login/signup with bcrypt password hashing
- Protected routes with middleware

### 🗑️ Waste Bin Management
- **6 Waste Categories**: Plastic, Paper, Metal, Organic, Glass, E-Waste
- **Real-time fill level tracking** (0-100%)
- **Auto-status calculation**: LOW (≤50%), MEDIUM (≤80%), HIGH (>80%)
- CRUD operations with modern modal interface
- Location tracking with latitude/longitude coordinates
- Search and filter by category/status

### 🤖 IoT Sensor Simulation
- **Persistent global state** - simulation continues across page navigation
- **Demo mode** with 6-12x faster fill rates for quick demonstrations
- 15-second update intervals for visible changes
- Realistic patterns based on:
  - Time of day (peak hours: 8-10 AM, 12-2 PM, 6-8 PM)
  - Waste category (different fill rates)
  - Auto-emptying when bins reach 95%
- Manual simulation controls for admins
- Activity log showing last 10 updates

### 📊 Analytics & Reports
- **Interactive Charts** powered by Recharts:
  - Pie chart for category distribution
  - Bar chart for status overview (LOW/MEDIUM/HIGH)
  - Horizontal bar chart for fill level trends
- **Real-time statistics**:
  - Total bins count
  - Average fill level across all bins
  - Bins requiring attention (>80% full)
  - Category-wise breakdown

### 📝 Special Requests System
- **3 Request Types**:
  - Manual Pickup
  - Maintenance
  - Hazardous Waste Alert
- **4 Priority Levels**: LOW, NORMAL, HIGH, URGENT
- **4 Status States**: PENDING, IN_PROGRESS, COMPLETED, CANCELLED
- Admin approval workflow
- Filter by status and type
- Link requests to specific bins
- Auto-refresh every 30 seconds
- User-specific views (users see only their requests)

### 🎨 Modern UI/UX
- **Consistent design system** with reusable components
- **Blue primary theme** (#2563eb)
- **Category-specific colors**:
  - Plastic: Blue
  - Paper: Purple
  - Metal: Gray
  - Organic: Green
  - Glass: Cyan
  - E-Waste: Orange
- Responsive design (mobile, tablet, desktop)
- Loading states and smooth animations
- Lucide React icons throughout

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** (App Router, Server Components)
- **TypeScript** (Strict mode)
- **TailwindCSS v4** (Modern gradient syntax)
- **Recharts** (Analytics visualization)
- **React Hook Form** (Form validation)
- **date-fns** (Date formatting)
- **Lucide React** (Icon library)

### Backend
- **Next.js API Routes**
- **PostgreSQL** (Database)
- **Prisma 5** (ORM)
- **NextAuth v5** (Authentication)
- **Zod** (Schema validation)
- **bcryptjs** (Password hashing)

## 📦 Installation

### Prerequisites
- **Node.js** 18+ 
- **PostgreSQL** 14+
- **npm** or **yarn**

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wastebin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/wastebin"

   # NextAuth
   AUTH_SECRET="your-secret-key-generate-with-openssl-rand-base64-32"
   AUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev

   # Seed the database
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 👤 Default Credentials

### Admin Account
- **Email**: admin@waste.com
- **Password**: admin123
- **Access**: Full system access, simulation controls, all requests

### User Account
- **Email**: user@waste.com
- **Password**: user123
- **Access**: View bins, submit requests, view personal requests

## 📁 Project Structure

```
wastebin/
├── app/
│   ├── api/
│   │   ├── auth/              # NextAuth endpoints
│   │   ├── bins/              # Bin CRUD endpoints
│   │   │   └── [id]/
│   │   │       ├── route.ts   # GET, PUT, DELETE
│   │   │       └── level/
│   │   │           └── route.ts # PATCH for IoT updates
│   │   ├── requests/          # Request CRUD endpoints
│   │   │   └── [id]/route.ts
│   │   └── simulation/        # IoT simulation control
│   ├── auth/
│   │   ├── login/             # Login page
│   │   └── signup/            # Signup page
│   ├── dashboard/
│   │   ├── admin/             # Admin dashboard
│   │   ├── reports/           # Analytics page
│   │   ├── requests/          # Requests page
│   │   └── page.tsx           # Main bins dashboard
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── components/
│   ├── charts/
│   │   ├── CategoryDistributionChart.tsx
│   │   ├── BinStatusChart.tsx
│   │   └── FillLevelTrendChart.tsx
│   ├── ui/                    # Reusable UI components
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── StatCard.tsx
│   ├── BinModal.tsx           # Bin create/edit modal
│   ├── BinsList.tsx           # Bins dashboard
│   ├── Navbar.tsx             # Navigation bar
│   ├── RequestModal.tsx       # Request creation modal
│   ├── RequestsList.tsx       # Requests dashboard
│   ├── SimulationControl.tsx  # Admin simulation panel
│   └── SimulationStatus.tsx   # Header status badge
├── hooks/
│   └── useSimulation.ts       # Global simulation state
├── lib/
│   ├── iot-simulator.ts       # IoT logic
│   ├── prisma.ts              # Prisma client
│   └── utils.ts               # Utility functions
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── auth.ts                    # NextAuth configuration
├── middleware.ts              # Route protection
└── package.json
```

## 🔑 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `AUTH_SECRET` | NextAuth secret key | Generate with `openssl rand -base64 32` |
| `AUTH_URL` | Application URL | `http://localhost:3000` |

## 📊 Database Schema

### Users
- **Fields**: id, email, password, name, role (ADMIN/USER)
- **Relations**: One-to-many with Requests

### Bins
- **Fields**: id, binId, category, location, coordinates, capacity, currentLevel, status
- **Categories**: PLASTIC, PAPER, METAL, ORGANIC, GLASS, EWASTE
- **Status**: LOW, MEDIUM, HIGH (auto-calculated)
- **Relations**: One-to-many with Requests

### Requests
- **Fields**: id, type, description, priority, status, userId, binId
- **Types**: MANUAL_PICKUP, MAINTENANCE, HAZARDOUS_WASTE
- **Priority**: LOW, NORMAL, HIGH, URGENT
- **Status**: PENDING, IN_PROGRESS, COMPLETED, CANCELLED
- **Relations**: Many-to-one with Users and Bins

## 🚀 Key Features Details

### Real-Time IoT Simulation
The system includes a sophisticated IoT sensor simulator that:
- Runs continuously in the background using global state
- Persists across page navigation and component unmounts
- Uses realistic fill patterns based on waste type and time
- Updates every 15 seconds with 2-5% changes for demo visibility
- Automatically empties bins when they reach 95% full
- Applies peak hour multipliers (1.5x during rush hours)

### Admin Dashboard
Admins have access to:
- **Simulation Control Panel** - Start/stop simulation, manual runs
- **Activity Log** - View last 10 simulation updates
- **All Requests** - Manage all user requests
- **Full CRUD** - Create, edit, delete bins
- **Status Management** - Approve/reject requests, change statuses

### User Dashboard
Regular users can:
- **View Bins** - See all waste bins and their fill levels
- **Submit Requests** - Create manual pickup, maintenance, or hazardous waste requests
- **Track Requests** - Monitor status of personal requests
- **View Reports** - Access analytics and statistics

## 🧪 Testing

### Manually Test Features:
1. **Login** as admin (admin@waste.com / admin123)
2. **Navigate** to Admin dashboard → Start IoT simulation
3. **Watch** bins fill up in real-time (navigate between pages to test persistence)
4. **Create** a new bin using the "+ New Bin" button
5. **View Reports** - Check analytics charts
6. **Submit Request** - Create a manual pickup request
7. **Login** as user (user@waste.com / user123)
8. **View** limited access (no admin controls)

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/signin` - Login
- `POST /api/auth/signup` - Register

### Bins
- `GET /api/bins` - List all bins (with filters)
- `POST /api/bins` - Create bin (admin only)
- `GET /api/bins/[id]` - Get single bin
- `PUT /api/bins/[id]` - Update bin (admin only)
- `DELETE /api/bins/[id]` - Delete bin (admin only)
- `PATCH /api/bins/[id]/level` - Update fill level (IoT)

### Requests
- `GET /api/requests` - List requests (filtered by role)
- `POST /api/requests` - Create request
- `GET /api/requests/[id]` - Get single request
- `PATCH /api/requests/[id]` - Update status (admin only)
- `DELETE /api/requests/[id]` - Delete request

### Simulation
- `POST /api/simulation` - Run simulation iteration
- `GET /api/simulation` - Get simulation stats

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop** (1920px+)
- **Laptop** (1024px - 1919px)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT session tokens
- ✅ Role-based middleware protection
- ✅ Server-side authentication checks
- ✅ Zod schema validation on all inputs
- ✅ SQL injection protection via Prisma
- ✅ CSRF protection via NextAuth

## 🎨 Design System

### Colors
- **Primary**: Blue (#2563eb)
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Danger**: Red (#ef4444)
- **Plastic**: Blue (#3b82f6)
- **Paper**: Purple (#a855f7)
- **Metal**: Gray (#6b7280)
- **Organic**: Green (#22c55e)
- **Glass**: Cyan (#06b6d4)
- **E-Waste**: Orange (#f97316)

### Typography
- **Font**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI)
- **Headings**: Bold, 600-700 weight
- **Body**: Regular, 400 weight

## 📝 Development

### Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma migrate dev # Create new migration
```

### Code Quality
- TypeScript strict mode enabled
- ESLint configured
- Prettier formatting
- Prisma schema validation

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Docker
1. Create Dockerfile
2. Build image: `docker build -t wastebin .`
3. Run container: `docker run -p 3000:3000 wastebin`

### Manual
1. Build: `npm run build`
2. Start: `npm start`
3. Ensure PostgreSQL is accessible
4. Set production environment variables

## 📄 License

This project is for educational purposes.

## 👥 Contributors

Built for a course assignment project.

## 🐛 Known Issues

- None currently reported

## 🔮 Future Enhancements

- [ ] Email notifications for urgent requests
- [ ] Mobile app (React Native)
- [ ] Map view for bin locations
- [ ] Advanced analytics (predictive fill times)
- [ ] Multi-tenancy support
- [ ] Export reports to PDF
- [ ] Real IoT hardware integration
- [ ] WebSocket for real-time updates

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ using Next.js 16 & TypeScript**
