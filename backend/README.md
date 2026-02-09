# Cooperative Farming Management Platform - Backend

## Overview
A comprehensive backend for managing farmer cooperatives with features for member registry, plot tracking, harvest records, equipment booking, shared expenses, and profit distribution.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (ready to implement)
- **Validation**: Joi
- **Security**: Helmet, CORS
- **Password Hash**: bcryptjs

## Project Structure
```
backend/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/      # Business logic controllers
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Helper functions
│   └── server.js        # Main server file
├── package.json
├── .env.example
└── README.md
```

## Features

### 1. Member Registry
- Create, read, update, delete members
- Track member information and status
- Password hashing for security
- Role-based access (member, admin, treasurer)
- Member statistics

**Endpoints:**
- `GET /api/members` - Get all members
- `POST /api/members` - Create new member
- `GET /api/members/:id` - Get member details
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member
- `GET /api/members/stats` - Get member statistics

### 2. Plot Tracking
- Register and manage agricultural plots
- Track plot size, location, soil type, water access
- Link plots to members
- Track multiple crops per plot
- Plot statistics and analytics

**Endpoints:**
- `GET /api/plots` - Get all plots
- `POST /api/plots` - Create new plot
- `GET /api/plots/:id` - Get plot details
- `PUT /api/plots/:id` - Update plot
- `DELETE /api/plots/:id` - Delete plot
- `GET /api/plots/stats` - Get plot statistics
- `GET /api/plots/member/:memberId` - Get member's plots

### 3. Harvest Records
- Record harvest details (weight, crop type, date)
- Track harvest status (pending, validated, stored, sold)
- Quality grading (excellent, good, average, poor)
- Validation workflow
- Harvest statistics and aggregation

**Endpoints:**
- `GET /api/harvests` - Get all harvests
- `POST /api/harvests` - Record new harvest
- `GET /api/harvests/:id` - Get harvest details
- `PUT /api/harvests/:id` - Update harvest
- `POST /api/harvests/:id/validate` - Validate harvest
- `DELETE /api/harvests/:id` - Delete harvest
- `GET /api/harvests/stats` - Get harvest statistics
- `GET /api/harvests/member/:memberId` - Get member harvests

### 4. Equipment Booking
- Register cooperative equipment
- Book equipment with automatic cost calculation
- Track equipment status and availability
- Maintenance scheduling
- Booking confirmation workflow

**Endpoints:**
- `GET /api/equipment` - Get all equipment
- `POST /api/equipment` - Add new equipment
- `GET /api/equipment/:id` - Get equipment details
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment
- `GET /api/equipment/available` - Get available equipment
- `GET /api/equipment/stats` - Get equipment statistics
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create booking
- `POST /api/bookings/:id/confirm` - Confirm booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking
- `GET /api/bookings/member/:memberId` - Get member bookings
- `GET /api/bookings/stats` - Get booking statistics

### 5. Shared Expenses
- Record cooperative expenses
- Distribute expenses among beneficiaries
- Track payment status
- Calculate individual shares
- Payment tracking

**Endpoints:**
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Record new expense
- `GET /api/expenses/:id` - Get expense details
- `PUT /api/expenses/:id` - Update expense
- `POST /api/expenses/:id/payment` - Record expense payment
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/member/:memberId` - Get member expenses
- `GET /api/expenses/stats` - Get expense statistics

### 6. Sales Management
- Record crop sales transactions
- Track buyer information
- Monitor payment status
- Quality grading for sales
- Sales statistics and reporting

**Endpoints:**
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Record new sale
- `GET /api/sales/:id` - Get sale details
- `PUT /api/sales/:id` - Update sale
- `POST /api/sales/:id/payment` - Record sale payment
- `DELETE /api/sales/:id` - Delete sale
- `GET /api/sales/member/:memberId` - Get member sales
- `GET /api/sales/stats` - Get sales statistics

### 7. Profit Distribution
- Create distribution plans from sales
- Calculate cooperative fees and net profit
- Distribute profits to members
- Track payment status
- Financial reporting and statistics

**Endpoints:**
- `GET /api/distributions` - Get all distributions
- `POST /api/distributions` - Create distribution
- `GET /api/distributions/:id` - Get distribution details
- `PUT /api/distributions/:id` - Update distribution
- `POST /api/distributions/:id/approve` - Approve distribution
- `POST /api/distributions/:id/payment` - Record member payment
- `DELETE /api/distributions/:id` - Delete distribution
- `GET /api/distributions/member/:memberId` - Get member distributions
- `GET /api/distributions/stats` - Get distribution statistics

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Setup Steps

1. **Clone and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/farming-coop
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   BCRYPT_ROUNDS=10
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Start MongoDB:**
   ```bash
   mongod
   ```

6. **Start the server:**
   ```bash
   # Development with hot reload
   npm run dev
   
   # Production
   npm start
   ```

The server will start on `http://localhost:5000`

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "id": "...",
    "name": "..."
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Database Models

### Member
- name, email, phone, village, plotSize
- role, status, password (hashed)
- joinDate, shares, contact info

### Plot
- plotCode, memberId, size, location
- soilType, waterAccess, status
- crops, registrationDate

### Harvest
- harvestCode, memberId, plotId
- crop, weight, unit, date, quality
- status, estimatedValue, photos

### Equipment
- equipmentCode, name, type, status
- rentalRate, rentalUnit, maintenanceSchedule
- ownershipType, currentValue

### EquipmentBooking
- bookingCode, memberId, equipmentId
- startDate, endDate, rentalCost
- status, damageReported, approvalStatus

### SharedExpense
- expenseCode, category, description
- amount, paidBy, beneficiaries
- status, attachments, approvalStatus

### Sale
- saleCode, harvestIds, memberIds, crop
- totalWeight, buyerName, unitPrice
- totalRevenue, paymentStatus, status

### ProfitDistribution
- distributionCode, saleId, summary
- memberDistributions, approvalStatus
- totalRevenue, expenses, netProfit

## Development

### Running Tests
```bash
npm test
```

### Code Structure
- Controllers handle business logic
- Routes define API endpoints
- Models define database schemas
- Middleware provides cross-cutting concerns
- Utils provide helper functions

## Security Considerations
- Passwords are hashed using bcryptjs
- CORS is configured for frontend access
- Helmet provides HTTP security headers
- Environment variables protect sensitive data
- Input validation is implemented

## Future Enhancements
- Authentication/Authorization (JWT)
- API rate limiting
- Request logging and monitoring
- Email notifications
- File upload for documents/photos
- Advanced analytics and reporting
- Mobile app integration
- Data export functionality

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env file

### Port Already in Use
- Change PORT in .env file
- Or kill process using the port

### Module Not Found
- Run `npm install`
- Clear node_modules: `rm -rf node_modules && npm install`

## Support
For issues or questions, please contact the development team.

## License
MIT
