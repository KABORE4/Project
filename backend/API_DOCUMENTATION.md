# API Documentation

## Base URL
- Development: `http://localhost:5000`
- Production: `https://api.farming-coop.com`

## Authentication
Currently uses stateless API calls. JWT authentication will be implemented in the next phase.

## Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Request Headers
```
Content-Type: application/json
Accept: application/json
```

## Data Types & Validation

### Member
```json
{
  "name": "string (required, max 100)",
  "email": "string (required, unique, valid email)",
  "phone": "string (required)",
  "village": "string (required)",
  "plotSize": "number (required, min 0.1)",
  "role": "enum: member|admin|treasurer (default: member)",
  "password": "string (required, min 6)",
  "status": "enum: active|inactive|suspended (default: active)"
}
```

### Plot
```json
{
  "plotCode": "string (required, unique)",
  "memberId": "ObjectId (required)",
  "size": "number (required, min 0.1)",
  "location": {
    "latitude": "number",
    "longitude": "number",
    "village": "string",
    "sector": "string"
  },
  "soilType": "enum: sandy|loamy|clay|mixed",
  "waterAccess": "enum: well|river|rain-fed|irrigation",
  "crops": "array of strings"
}
```

### Harvest
```json
{
  "harvestCode": "string (required, unique)",
  "memberId": "ObjectId (required)",
  "plotId": "ObjectId (required)",
  "crop": "enum: cotton|millet|sorghum|maize|sesame|peanut",
  "weight": "number (required)",
  "unit": "enum: kg|ton|bag (default: kg)",
  "harvestDate": "date (required)",
  "quality": "enum: excellent|good|average|poor",
  "estimatedValue": "number",
  "status": "enum: pending|validated|stored|sold"
}
```

### Equipment
```json
{
  "equipmentCode": "string (required, unique)",
  "name": "string (required)",
  "type": "enum: heavy|light|transport|irrigation|storage",
  "purchasePrice": "number",
  "rentalRate": "number (required)",
  "rentalUnit": "enum: per-hour|per-day|per-week (default: per-day)",
  "status": "enum: available|in-use|maintenance|retired"
}
```

### EquipmentBooking
```json
{
  "bookingCode": "string (required, unique)",
  "memberId": "ObjectId (required)",
  "equipmentId": "ObjectId (required)",
  "startDate": "date (required)",
  "endDate": "date (required)",
  "purpose": "string (required)",
  "status": "enum: pending|confirmed|in-use|completed|cancelled"
}
```

### SharedExpense
```json
{
  "expenseCode": "string (required, unique)",
  "category": "enum: maintenance|fertilizer|seeds|fuel|labor|storage|transport|other",
  "description": "string (required)",
  "amount": "number (required)",
  "paidBy": "ObjectId (required)",
  "beneficiaries": [
    {
      "memberId": "ObjectId",
      "sharePercentage": "number (0-100)"
    }
  ],
  "status": "enum: pending|approved|settled"
}
```

### Sale
```json
{
  "saleCode": "string (required, unique)",
  "harvestIds": "Array<ObjectId>",
  "memberIds": "Array<ObjectId>",
  "crop": "enum: cotton|millet|sorghum|maize|sesame|peanut",
  "totalWeight": "number (required)",
  "buyerName": "string (required)",
  "unitPrice": "number (required)",
  "totalRevenue": "number (auto-calculated)",
  "saleDate": "date (required)",
  "paymentStatus": "enum: pending|partial|completed"
}
```

### ProfitDistribution
```json
{
  "distributionCode": "string (required, unique)",
  "saleId": "ObjectId (required)",
  "totalRevenue": "number (required)",
  "cooperativeShare": "number (0-1, default: 0.1)",
  "memberDistributions": [
    {
      "memberId": "ObjectId",
      "sharePercentage": "number"
    }
  ],
  "status": "enum: pending|approved|distributed|completed"
}
```

## Example API Calls

### Create a Member
```bash
POST /api/members
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

### Get Member Details
```bash
GET /api/members/:id
```

### Record a Harvest
```bash
POST /api/harvests
Content-Type: application/json

{
  "harvestCode": "HRV-001",
  "memberId": "60d5ec49c1234a001f5b1c8f",
  "plotId": "60d5ec49c1234a001f5b1c90",
  "crop": "cotton",
  "weight": 1200,
  "unit": "kg",
  "harvestDate": "2024-12-15",
  "quality": "good"
}
```

### Book Equipment
```bash
POST /api/bookings
Content-Type: application/json

{
  "bookingCode": "BKG-001",
  "memberId": "60d5ec49c1234a001f5b1c8f",
  "equipmentId": "60d5ec49c1234a001f5b1c91",
  "startDate": "2024-12-20",
  "endDate": "2024-12-25",
  "purpose": "Field preparation"
}
```

### Record Shared Expense
```bash
POST /api/expenses
Content-Type: application/json

{
  "expenseCode": "EXP-001",
  "category": "fertilizer",
  "description": "Bulk fertilizer purchase",
  "amount": 450000,
  "paidBy": "60d5ec49c1234a001f5b1c8f",
  "beneficiaries": [
    {
      "memberId": "60d5ec49c1234a001f5b1c8f",
      "sharePercentage": 50
    },
    {
      "memberId": "60d5ec49c1234a001f5b1c90",
      "sharePercentage": 50
    }
  ],
  "expenseDate": "2024-12-01"
}
```

### Record a Sale
```bash
POST /api/sales
Content-Type: application/json

{
  "saleCode": "SAL-001",
  "harvestIds": ["60d5ec49c1234a001f5b1c92"],
  "memberIds": ["60d5ec49c1234a001f5b1c8f"],
  "crop": "cotton",
  "totalWeight": 1200,
  "buyerName": "SOFITEX",
  "unitPrice": 300,
  "saleDate": "2024-12-20"
}
```

### Create Profit Distribution
```bash
POST /api/distributions
Content-Type: application/json

{
  "distributionCode": "DIST-001",
  "saleId": "60d5ec49c1234a001f5b1c93",
  "totalRevenue": 360000,
  "cooperativeShare": 0.1,
  "memberDistributions": [
    {
      "memberId": "60d5ec49c1234a001f5b1c8f",
      "sharePercentage": 100
    }
  ],
  "distributionDate": "2024-12-21"
}
```

## Error Handling

All errors follow this format:
```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

Common error scenarios:
- **Validation Error (400)**: Invalid input data
- **Not Found (404)**: Resource doesn't exist
- **Conflict (409)**: Duplicate unique field
- **Server Error (500)**: Internal server error

## Rate Limiting (Future)
Coming in next phase

## Pagination (Future)
Coming in next phase

## WebSocket Support (Future)
Coming in next phase for real-time updates
