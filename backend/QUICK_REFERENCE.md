# Quick Reference Guide

## 🚀 Getting Started

### Start Development Server
```bash
# With Docker (easiest)
cd backend
docker-compose up -d

# Or locally with PostgreSQL
npm install
npm run dev
```

### Health Check
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "ok",
  "database": "PostgreSQL",
  "authentication": "JWT",
  "environment": "development"
}
```

## 🔐 Authentication Flow

### 1. Register New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "70-12-34-56",
    "village": "Ouahigouya",
    "plotSize": 5.5,
    "password": "MyPassword123",
    "role": "member"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "MyPassword123"
  }'
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member"
  }
}
```

### 3. Use Token in Requests
```bash
curl http://localhost:5000/api/members \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 📋 API Endpoints Summary

### Authentication (No Auth Required)
```
POST   /api/auth/register              - Register new member
POST   /api/auth/login                 - Login and get token
```

### Authentication (Requires Auth)
```
GET    /api/auth/profile               - Get current user
POST   /api/auth/change-password       - Change password
```

### Members (Requires Auth)
```
GET    /api/members                    - List all members
GET    /api/members/:id                - Get member details
POST   /api/members                    - Create member (admin)
PUT    /api/members/:id                - Update member
DELETE /api/members/:id                - Delete member (admin)
GET    /api/members/stats              - Statistics
```

### Plots (Requires Auth)
```
GET    /api/plots                      - List all plots
GET    /api/plots/:id                  - Get plot details
GET    /api/plots/member/:memberId     - Get member plots
POST   /api/plots                      - Create plot
PUT    /api/plots/:id                  - Update plot
DELETE /api/plots/:id                  - Delete plot (admin)
GET    /api/plots/stats                - Statistics
```

### Harvests (Requires Auth)
```
GET    /api/harvests                   - List all harvests
GET    /api/harvests/:id               - Get harvest details
GET    /api/harvests/member/:memberId  - Get member harvests
POST   /api/harvests                   - Record harvest
PUT    /api/harvests/:id               - Update harvest
POST   /api/harvests/:id/validate      - Validate harvest
DELETE /api/harvests/:id               - Delete harvest (admin)
GET    /api/harvests/stats             - Statistics
```

### Equipment (Requires Auth)
```
GET    /api/equipment                  - List all equipment
GET    /api/equipment/:id              - Get equipment details
GET    /api/equipment/available        - Get available equipment
POST   /api/equipment                  - Add equipment (admin)
PUT    /api/equipment/:id              - Update equipment
DELETE /api/equipment/:id              - Delete equipment (admin)
GET    /api/equipment/stats            - Statistics
```

### Equipment Bookings (Requires Auth)
```
GET    /api/bookings                   - List all bookings
GET    /api/bookings/:id               - Get booking details
GET    /api/bookings/member/:memberId  - Get member bookings
POST   /api/bookings                   - Create booking
PUT    /api/bookings/:id               - Update booking
POST   /api/bookings/:id/confirm       - Confirm booking (admin)
DELETE /api/bookings/:id               - Delete booking (admin)
GET    /api/bookings/stats             - Statistics
```

### Shared Expenses (Requires Auth, Treasurer/Admin)
```
GET    /api/expenses                   - List all expenses
GET    /api/expenses/:id               - Get expense details
GET    /api/expenses/member/:memberId  - Get member expenses
POST   /api/expenses                   - Create expense
PUT    /api/expenses/:id               - Update expense
POST   /api/expenses/:id/payment       - Record payment
DELETE /api/expenses/:id               - Delete expense (admin)
GET    /api/expenses/stats             - Statistics
```

### Sales (Requires Auth, Treasurer/Admin)
```
GET    /api/sales                      - List all sales
GET    /api/sales/:id                  - Get sale details
GET    /api/sales/member/:memberId     - Get member sales
POST   /api/sales                      - Record sale
PUT    /api/sales/:id                  - Update sale
POST   /api/sales/:id/payment          - Record payment
DELETE /api/sales/:id                  - Delete sale (admin)
GET    /api/sales/stats                - Statistics
```

### Profit Distribution (Requires Auth, Admin Only)
```
GET    /api/distributions              - List all distributions
GET    /api/distributions/:id          - Get distribution
GET    /api/distributions/member/:id   - Get member distributions
POST   /api/distributions              - Create distribution
POST   /api/distributions/:id/approve  - Approve distribution
POST   /api/distributions/:id/payment  - Record payment
PUT    /api/distributions/:id          - Update distribution
DELETE /api/distributions/:id          - Delete distribution
GET    /api/distributions/stats        - Statistics
```

## 🔑 Environment Variables

### .env (Development)
```env
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=farming_coop
DB_USER=postgres
DB_PASSWORD=postgres
DB_DIALECT=postgres

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

# Security
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:3000
```

### .env (Production)
```env
NODE_ENV=production
PORT=5000

# Database (use environment-specific values)
DB_HOST=prod-db.example.com
DB_PORT=5432
DB_NAME=farming_coop
DB_USER=postgres
DB_PASSWORD=STRONG_PASSWORD_HERE
DB_DIALECT=postgres

# JWT (use strong secret)
JWT_SECRET=LONG_RANDOM_SECRET_STRING_HERE
JWT_EXPIRE=7d

# Security
BCRYPT_ROUNDS=12
CORS_ORIGIN=https://yourdomain.com
```

## 🗄️ Database Schema Quick Reference

### Key Tables
- **members** - User accounts with roles
- **plots** - Agricultural plots
- **harvests** - Harvest records
- **equipment** - Equipment inventory
- **equipment_bookings** - Equipment reservations
- **shared_expenses** - Cooperative expenses
- **sales** - Sales records
- **profit_distributions** - Profit sharing

### All tables have:
- `id` (UUID primary key)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

## 🧪 Testing with cURL

### Test Create Plot
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
MEMBER_ID="550e8400-e29b-41d4-a716-446655440000"

curl -X POST http://localhost:5000/api/plots \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "plotCode": "PLOT-001",
    "memberId": "'$MEMBER_ID'",
    "size": 2.5,
    "location": "North Field",
    "soilType": "Loamy",
    "waterAccess": "irrigation",
    "crops": ["millet", "sorghum"]
  }'
```

### Test Get Statistics
```bash
curl http://localhost:5000/api/plots/stats \
  -H "Authorization: Bearer $TOKEN"
```

## 🐳 Docker Commands

### Start Services
```bash
docker-compose up -d
```

### Check Status
```bash
docker-compose ps
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f backend    # Backend logs
docker-compose logs -f postgres   # Database logs
```

### Connect to Database
```bash
docker exec -it farming-postgres psql -U postgres -d farming_coop
```

## 🔍 Troubleshooting

### Database Connection Error
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check credentials in .env
cat .env | grep DB_
```

### JWT Token Invalid
```bash
# Make sure token format is: "Bearer TOKEN"
# Check token hasn't expired (default 7 days)
# Verify JWT_SECRET in .env
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Or change PORT in .env
```

### CORS Errors
```bash
# Check CORS_ORIGIN in .env matches your frontend URL
# Example: http://localhost:3000
```

## 📖 Useful Commands

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Run Production Server
```bash
npm start
```

### Check Node Version
```bash
node --version
```

### Check npm Version
```bash
npm --version
```

### Update npm
```bash
npm install -g npm@latest
```

## 🔧 Role Matrix

| Operation | Member | Treasurer | Admin |
|-----------|--------|-----------|-------|
| View Own Data | ✅ | ✅ | ✅ |
| View All Data | ❌ | ✅ | ✅ |
| Create Plots | ✅ | ✅ | ✅ |
| Create Harvests | ✅ | ✅ | ✅ |
| Book Equipment | ✅ | ✅ | ✅ |
| Create Expenses | ❌ | ✅ | ✅ |
| Approve Expenses | ❌ | ✅ | ✅ |
| Create Sales | ❌ | ✅ | ✅ |
| Approve Sales | ❌ | ✅ | ✅ |
| Distribute Profits | ❌ | ❌ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |
| Delete Records | ❌ | ❌ | ✅ |

## 📞 Important Notes

1. **First Run**: Database tables are created automatically via Sequelize sync()
2. **Token Expiry**: Default is 7 days (configurable via JWT_EXPIRE)
3. **Password**: Minimum 6 characters, hashed with bcryptjs
4. **IDs**: All records use UUID v4 (unique across systems)
5. **Timestamps**: All records include createdAt and updatedAt

---

**Status**: ✅ Production Ready
**Version**: PostgreSQL + Sequelize + JWT + RBAC
**Last Updated**: 2024
