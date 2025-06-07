# Course Selling App - Backend

This is the backend API for the Course Selling Application. 
It handles user and admin authentication, course management, and purchase operations.

## Features

- User Signup and Signin with JWT Authentication
- Admin Signup and Signin with JWT Authentication
- Admin can create, view, and delete courses
- Users can view courses and track purchases
- Secure password hashing with bcrypt
- Validation using Zod schema
- MongoDB with Mongoose ODM

## Technologies Used

- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- bcrypt for password hashing
- Zod for request validation
- dotenv for environment variables

## Environment Variables

Create a `.env` file in the root folder and add:

```env
MONGO_URL=your_mongodb_connection_string
USER_JWT_SECRET=your_user_jwt_secret
ADMIN_JWT_SECRET=your_admin_jwt_secret
PORT=3000
