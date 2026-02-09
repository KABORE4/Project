# Quick Start Guide - Farming Cooperative Backend

## Option 1: Local Development (Recommended for Development)

### Prerequisites
- Node.js v14+ installed
- MongoDB running locally (or MongoDB Atlas cloud account)

### Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/farming-coop
   JWT_SECRET=dev_secret_key_change_in_production
   ```

3. **Start MongoDB** (if local)
   ```bash
   mongod
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Verify Server**
   Open browser: `http://localhost:5000/api/health`

---

## Option 2: Docker & Docker Compose (Recommended for Deployment)

### Prerequisites
- Docker installed
- Docker Compose installed

### Setup

1. **Build and Start Containers**
   ```bash
   cd backend
   docker-compose up -d
   ```

2. **View Logs**
   ```bash
   docker-compose logs -f backend
   ```

3. **Stop Containers**
   ```bash
   docker-compose down
   ```

4. **Access Services**
   - Backend API: `http://localhost:5000`
   - MongoDB: `localhost:27017`

---

## Common Commands

### Development
```bash
# Start with hot reload
npm run dev

# Start production
npm start

# Run tests
npm test
```

### Docker
```bash
# Build Docker image
docker build -t farming-coop-backend .

# Run container
docker run -p 5000:5000 --env-file .env farming-coop-backend

# Docker Compose
docker-compose up -d
docker-compose down
docker-compose logs -f
```

---

## Database Setup

### MongoDB Local
```bash
# Install MongoDB
# macOS: brew install mongodb-community
# Linux: Follow MongoDB installation guide
# Windows: Download from mongodb.com

# Start service
mongod

# Access shell
mongosh
```

### MongoDB Atlas (Cloud)
1. Create account at mongodb.com
2. Create cluster
3. Get connection string
4. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/farming-coop?retryWrites=true&w=majority
   ```

---

## Testing API Endpoints

### Using curl
```bash
# Health check
curl http://localhost:5000/api/health

# Get all members
curl http://localhost:5000/api/members

# Create member
curl -X POST http://localhost:5000/api/members \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "70-12-34-56",
    "village": "Ouahigouya",
    "plotSize": 5.5,
    "password": "secure123"
  }'
```

### Using Postman
1. Import API endpoints
2. Set base URL: `http://localhost:5000`
3. Create requests for each endpoint
4. Test CRUD operations

### Using VS Code REST Client
Create `.http` file:
```http
### Health Check
GET http://localhost:5000/api/health

### Get All Members
GET http://localhost:5000/api/members

### Create Member
POST http://localhost:5000/api/members
Content-Type: application/json

{
  "name": "Jean Sawadogo",
  "email": "jean@example.com",
  "phone": "70-12-34-56",
  "village": "Ouahigouya",
  "plotSize": 5.5,
  "password": "secure123"
}
```

---

## Troubleshooting

### Port 5000 Already in Use
```bash
# Kill process using port 5000
# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access (if using MongoDB Atlas)

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables Not Loading
- Ensure `.env` file exists in `backend/` directory
- Restart server after changes
- Check spelling of variable names

---

## Project Structure

```
backend/
├── src/
│   ├── config/           # Database config
│   ├── controllers/       # Business logic (8 files)
│   ├── models/           # MongoDB schemas (7 files)
│   ├── routes/           # API endpoints (8 files)
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Helper functions
│   └── server.js         # Main server file
├── package.json          # Dependencies
├── .env.example          # Template env
├── .gitignore
├── README.md
├── API_DOCUMENTATION.md
├── Dockerfile
└── docker-compose.yml
```

---

## Features Implemented

✅ Member Registry - Full CRUD + stats
✅ Plot Tracking - Plot management with location
✅ Harvest Records - Recording & validation
✅ Equipment Management - Inventory & rental system
✅ Equipment Booking - Reservation system with cost calculation
✅ Shared Expenses - Cost distribution & payment tracking
✅ Sales Management - Recording crop sales
✅ Profit Distribution - Automated distribution calculation

---

## Next Steps

1. **Frontend Integration**
   - Connect React frontend to API
   - Update CORS_ORIGIN in `.env`

2. **Authentication**
   - Implement JWT middleware
   - Add login/logout endpoints
   - Add role-based access control

3. **Validation**
   - Add Joi schema validation
   - Implement validation middleware

4. **Testing**
   - Write unit tests with Jest
   - Write integration tests
   - Setup CI/CD pipeline

5. **Deployment**
   - Deploy to AWS/Heroku/DigitalOcean
   - Setup environment-specific configs
   - Setup SSL certificates

---

## Support

For issues or questions, check:
- README.md - Overview and setup
- API_DOCUMENTATION.md - Endpoint details
- .env.example - Configuration template
- Models - Data schema reference

---

## Tips

1. **Keep .env secure** - Never commit to git
2. **Test endpoints** before frontend integration
3. **Monitor logs** during development
4. **Use consistent naming** for resources
5. **Document changes** as you extend the API

---

Last Updated: February 2026
