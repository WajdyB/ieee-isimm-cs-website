# Troubleshooting Guide

## Common Issues and Solutions

### 1. "MONGODB_URI is required" Error

**Problem**: The MongoDB URI is not being loaded from environment variables.

**Solutions**:
1. **Restart the development server**:
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart
   npm run dev
   ```

2. **Verify environment variables**:
   - Check that `.env.local` exists in the project root
   - Ensure variables are properly formatted:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```

3. **Test the connection**:
   - Visit `http://localhost:3000/api/test` to test MongoDB connection
   - Should return: `{"success":true,"message":"MongoDB connection successful"}`

### 2. Database Connection Issues

**Problem**: API endpoints return 500 errors.

**Solutions**:
1. **Check MongoDB project**:
   - Verify your database is active in MongoDB dashboard
   - Check if collections exist: `events`, `committee_members`, `admin_users`

2. **Check user permissions**:
   - Ensure your MongoDB user has read/write access to the database

### 3. Admin Login Issues

**Problem**: Cannot login to admin panel.

**Solutions**:
1. **Check environment variables**:
   ```env
   ADMIN_EMAIL=admin@wie-isimm.org
   ADMIN_PASSWORD=admin123
   ```

2. **Test login API**:
   - Use browser dev tools or Postman to test:
   ```bash
   POST http://localhost:3000/api/auth/login
   Content-Type: application/json
   {
     "email": "admin@wie-isimm.org",
     "password": "admin123"
   }
   ```

### 4. Events Not Loading

**Problem**: Events page shows "No Events Found".

**Solutions**:
1. **Check database**:
   - Verify events exist in MongoDB dashboard
   - Check if API returns data: `GET http://localhost:3000/api/events`

2. **Check API logs**:
   - Review server logs for errors related to MongoDB

### Debug Mode
Enable debug logging by adding to `.env.local`:
```env
DEBUG=true
``` 