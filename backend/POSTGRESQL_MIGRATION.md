# PostgreSQL Migration Guide

## Migration from MongoDB to PostgreSQL

Your backend has been successfully migrated from MongoDB with Mongoose to PostgreSQL with Sequelize ORM.

## What Changed

### 1. **Database Technology**
- **Before:** MongoDB (NoSQL)
- **After:** PostgreSQL (SQL)

### 2. **ORM**
- **Before:** Mongoose
- **After:** Sequelize

### 3. **Key Dependencies**
- **Removed:** mongoose (^7.0.0)
- **Added:** sequelize (^6.33.0), pg (^8.10.0), pg-hstore (^2.3.4), sequelize-cli (^6.6.2)

### 4. **Configuration**
- **Before:** MONGODB_URI
- **After:** DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_DIALECT

### 5. **Data Types**
- MongoDB ObjectId → PostgreSQL UUID
- Mongoose nested objects → JSON columns
- Mongoose arrays → JSON arrays

## Setup Instructions

### Option 1: Local PostgreSQL

#### Windows
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Install with default settings
3. Create database:
   ```bash
   createdb farming_coop
   ```
4. Update .env:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=farming_coop
   DB_USER=postgres
   DB_PASSWORD=<your_password>
   DB_DIALECT=postgres
   ```
5. Install dependencies:
   ```bash
   npm install
   ```
6. Start server:
   ```bash
   npm run dev
   ```

#### Mac
```bash
# Install PostgreSQL
brew install postgresql

# Start PostgreSQL
brew services start postgresql

# Create database
createdb farming_coop

# Update .env with your config
```

#### Linux (Ubuntu)
```bash
# Install PostgreSQL
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql

# Create database
sudo -u postgres createdb farming_coop
```

### Option 2: Docker (Recommended)
```bash
cd backend
docker-compose up -d
```

This starts:
- PostgreSQL 15 on port 5432
- Backend API on port 5000

## New Features Added

### ✅ JWT Authentication
- Register: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- Profile: `GET /api/auth/profile` (protected)
- Change Password: `POST /api/auth/change-password` (protected)

### ✅ Role-Based Access Control
Three roles available:
- **admin** - Full access to all endpoints
- **treasurer** - Access to financial operations
- **member** - Basic access to own data

### ✅ Protected Endpoints
All endpoints except `/api/auth/register` and `/api/auth/login` now require JWT token:

```bash
curl -H "Authorization: Bearer <token>" http://localhost:5000/api/members
```

## Example: Register and Login

### 1. Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Jean Sawadogo",
  "email": "jean@example.com",
  "phone": "70-12-34-56",
  "village": "Ouahigouya",
  "plotSize": 5.5,
  "password": "secure123",
  "role": "member"
}

Response:
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGc...",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Jean Sawadogo",
    "email": "jean@example.com",
    "role": "member"
  }
}
```

### 2. Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "jean@example.com",
  "password": "secure123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Jean Sawadogo",
    "email": "jean@example.com",
    "role": "member"
  }
}
```

### 3. Use Token in Protected Requests
```bash
GET /api/members
Authorization: Bearer eyJhbGc...
```

## Database Schema

### Tables Created
All tables will be automatically created on first run:

- **members** - User registry with password hashing
- **plots** - Agricultural plots
- **harvests** - Harvest records
- **equipment** - Equipment inventory
- **equipment_bookings** - Equipment reservations
- **shared_expenses** - Cooperative expenses
- **sales** - Crop sales
- **profit_distributions** - Profit sharing

### Data Types

#### UUIDs
- All primary keys are IDs: `UUID (DEFAULT gen_random_uuid())`
- Example: `550e8400-e29b-41d4-a716-446655440000`

#### JSON Columns
- `photos` (ARRAY)
- `crops` (ARRAY)
- `beneficiaries` (OBJECT)
- `memberDistributions` (ARRAY)
- etc.

#### Decimals
- Currency fields use `DECIMAL(15, 2)`
- Percentages use `DECIMAL(4, 3)`

## Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000

# PostgreSQL Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=farming_coop
DB_USER=postgres
DB_PASSWORD=your_password
DB_DIALECT=postgres

# JWT
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d

# Security
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:3000
```

## Troubleshooting

### Port 5432 Already in Use
```bash
# Kill the process on port 5432
# macOS/Linux
lsof -i :5432
kill -9 <PID>

# Windows
netstat -ano | findstr :5432
taskkill /PID <PID> /F
```

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

Solution:
- Ensure PostgreSQL is running
- Check connection string in .env
- Verify credentials

### JWT Token Invalid
```
"message": "Invalid or expired token"
```

Solution:
- Include `Authorization: Bearer <token>` header
- Ensure token hasn't expired (default: 7 days)
- Check JWT_SECRET in .env

### Sequelize Validation Error
```
"message": "Email already in use"
```

Solution:
- Unique constraints are enforced at database level
- Use different email for new members

## API Changes

### Authentication Required
All endpoints now require authentication except:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/health`
- `GET /api`

### Token Format
```
Authorization: Bearer <jwt_token>
```

### Role Headers
Roles determine access:
- **admin**: All endpoints
- **treasurer**: Financial endpoints (`/expenses`, `/distributions`)
- **member**: General endpoints (with restrictions)

## Performance Tips

1. **Indexes**: Automatically created on frequently queried fields
2. **Connection Pooling**: Configured for 5 connections max
3. **Prepared Statements**: Sequelize prevents SQL injection
4. **Query Caching**: Use appropriate query parameters

## Migration Data (Manual)

If you have existing MongoDB data:

1. Export MongoDB data as JSON
2. Transform to PostgreSQL format
3. Import using SQL COPY or Sequelize bulk create:

```javascript
await Member.bulkCreate(membersData);
```

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Configure .env file
3. ✅ Start server: `npm run dev` or `docker-compose up -d`
4. ✅ Test endpoints with authentication
5. ✅ Deploy to production

## Support

- Check QUICK_START.md for general setup
- Review API_DOCUMENTATION.md for endpoint details
- Check logs for detailed error messages

---

**Database:** PostgreSQL 15
**ORM:** Sequelize 6+
**Authentication:** JWT
**Status:** ✅ Ready for production
