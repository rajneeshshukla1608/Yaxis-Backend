
# Y-Axis Overseas

This is the API Documentation of Y-axis Visa Immigration Platform

# Y-Axis Immigration Backend API Documentation

Base URL: `http://localhost:8000`

## Authentication
All protected routes require authentication via a JWT token stored in HTTP-only cookies.

## Health Check
```http
GET /health
```
Response:
```json
{
  "success": true,
  "message": "Visa Immigration Backend API is running",
  "timestamp": "2024-03-14T12:00:00.000Z",
  "environment": "development"
}
```

## Authentication Routes
### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "Rajneesh Shukla",
  "email": "rajpg16@gmail.com",
  "password": "yourpassword"
}
```

### Sign In
```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "rajpg16@gmail.com",
  "password": "yourpassword"
}
```

### Logout
```http
POST /api/auth/logout
```

## Product Routes
### Get All Products
```http
GET /api/products
```

### Get Product by ID
```http
GET /api/products/:id
```

### Create Product (Admin)
```http
POST /api/products
Content-Type: application/json

{
  "name": "Tourist Visa",
  "description": "Complete tourist visa processing",
  "price": 150,
  "category": "Visa Services"
}
```

## Cart Routes
### Get Cart
```http
GET /api/cart
```

### Add to Cart
```http
POST /api/cart
Content-Type: application/json

{
  "productId": "product_id_here",
  "quantity": 1
}
```

### Update Cart Item Quantity
```http
PUT /api/cart/:itemId/quantity
Content-Type: application/json

{
  "quantity": 2
}
```

### Remove from Cart
```http
DELETE /api/cart/:itemId
```

### Clear Cart
```http
DELETE /api/cart/clear
```

## Checkout Routes
### Create Order
```http
POST /api/checkout
Content-Type: application/json

{
  "items": [
    {
      "productId": "product_id_here",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

### Get Order by ID
```http
GET /api/checkout/order/:orderId
```

### Get User Orders
```http
GET /api/checkout/orders
```

## Important Notes

1. **Authentication**:
   - All protected routes require authentication
   - JWT token is stored in HTTP-only cookies
   - Include `credentials: 'include'` in frontend requests

2. **CORS**:
   - Backend is configured to accept requests from `http://localhost:3000`
   - Credentials are allowed
   - Supported methods: GET, POST, PUT, DELETE, OPTIONS

3. **Error Handling**:
   - All errors return a consistent format:
   ```json
   {
     "success": false,
     "message": "Error message",
     "error": "Detailed error in development"
   }
   ```

4. **Session**:
   - Session cookie expires in 24 hours
   - SameSite is set to 'lax' for CORS compatibility

## Testing in Postman

1. Create a new collection for Y-Axis API
2. Set up environment variables:
   - `baseUrl`: http://localhost:8000
   - `token`: (will be set after login)

3. Authentication Flow:
   - Sign up or sign in to get the session cookie
   - Postman will automatically handle cookies
   - Use the "Cookies" tab in Postman to verify cookie storage

4. Request Headers:
   - Content-Type: application/json
   - Accept: application/json

5. Testing Protected Routes:
   - Ensure you're signed in
   - Check that cookies are being sent
   - Verify token expiration

## Common Response Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error
