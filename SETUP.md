# WIE ISIMM Website - Backend Setup Guide

This guide will help you set up the backend for the WIE ISIMM website with admin authentication and event management using MongoDB.

## 🚀 Quick Start

### 1. Environment Setup

1. **Create a MongoDB Database**
   - Go to [mongodb.com](https://mongodb.com) or use your preferred MongoDB provider
   - Create a new database (e.g., `wie-website`)
   - Note down your connection URI

2. **Configure Environment Variables**
   - Copy `.env.local` and update with your MongoDB credentials:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ADMIN_EMAIL=admin@wie-isimm.org
   ADMIN_PASSWORD=admin123
   ```

### 2. Database Setup

- Collections will be created automatically: `events`, `committee_members`, `admin_users`.
- No manual SQL scripts are needed.

### 3. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 4. Start Development Server

```bash
npm run dev
# or
pnpm dev
```

## 🔧 Features Implemented

### ✅ Admin Authentication
- **Login System**: Email/password authentication (from environment variables or MongoDB)
- **Secure Access**: Admin-only dashboard
- **Session Management**: Automatic logout on page refresh

### ✅ Event Management
- **Create Events**: Add new events with title, description, date, location, attendees
- **Edit Events**: Modify existing event details
- **Delete Events**: Remove events from the database
- **Image Upload**: Support for multiple event images (stored in MongoDB GridFS)

### ✅ Database Integration
- **Real-time Data**: Events page fetches data from MongoDB
- **CRUD Operations**: Full Create, Read, Update, Delete functionality
- **Error Handling**: Proper error messages and fallbacks

### ✅ API Endpoints
- `POST /api/auth/login` - Admin authentication
- `GET /api/events` - Fetch all events
- `POST /api/events` - Create new event
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event
- `POST /api/upload` - Upload event images

## 🎯 Usage

### Admin Access
1. Navigate to `/admin`
2. Login with credentials:
   - Email: `admin@wie-isimm.org`
   - Password: `admin123`

### Managing Events
1. **View Events**: See all events in the database
2. **Add Event**: Fill out the form and click "Add Event"
3. **Edit Event**: Click the edit button on any event
4. **Delete Event**: Click the delete button (with confirmation)

### Public Events Page
- Navigate to `/events` to see the public events gallery
- Events are automatically loaded from the database
- Lightbox gallery for viewing event images

## 🔒 Security Notes

- **Environment Variables**: Never commit `.env.local` to version control
- **Admin Credentials**: Change default admin password in production
- **Database Permissions**: Configure MongoDB user permissions for production
- **API Rate Limiting**: Consider adding rate limiting for production

## 🚧 Future Enhancements

### Image Upload
- Images are now stored in MongoDB GridFS.
- File type and size validation is implemented.
- Image optimization (resizing/compression) can be added.

### Enhanced Authentication
- **JWT Tokens**: Implement proper session management
- **Password Hashing**: Use bcrypt for password security
- **Multi-factor Authentication**: Add 2FA support

### Additional Features
- **Event Categories**: Add event categorization
- **Search & Filter**: Implement event search functionality
- **Email Notifications**: Send notifications for new events
- **Analytics**: Track event views and engagement

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MongoDB URI in `.env.local`
   - Check if collections exist in MongoDB dashboard

2. **Admin Login Fails**
   - Ensure environment variables are set correctly
   - Check browser console for API errors

3. **Events Not Loading**
   - Verify API routes are working
   - Check database for existing events
   - Review browser network tab for errors

### Debug Mode
Enable debug logging by adding to `.env.local`:
```env
DEBUG=true
```

## 📞 Support

For issues or questions:
1. Check the browser console for error messages
2. Verify all environment variables are set
3. Ensure database collections are created correctly
4. Test API endpoints directly using tools like Postman

---

**Note**: This is a marketing website with basic admin functionality. For production use, implement additional security measures and proper image upload functionality. 