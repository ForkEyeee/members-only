---

# Members Only Clubhouse Application

A web application for an exclusive clubhouse where members can post anonymously, offering enhanced features for members and admins.

## Setup and Installation

Run this exclusive clubhouse app on your local setup by following the given steps.

### Prerequisites

Make sure [Node.js](https://nodejs.org/en/download/) and [npm](http://npmjs.com) are installed on your system.

### Steps

1. Clone the project repository:

   ```bash
   git clone https://github.com/ForkEyeee/members-only-clubhouse
   ```

2. Navigate to the project directory:

   ```bash
   cd members-only-clubhouse
   ```

3. Install required dependencies:

   ```bash
   npm install
   ```

4. Configure your environment variables by creating a `.env` file in the root directory that contains your MongoDB connection URI in the format dev_db_url = "connection string"


5. Start the development server:

   ```bash
   npm run serverstart
   ```

Access the application in your browser at `http://localhost:8000`.

## Building for Production

For deploying in a production environment:

```bash
npm run build
```

## Technology Stack

The Members Only Clubhouse is powered by:

- [Node.js](https://nodejs.org/en/) for a robust runtime environment.
- [Express](https://expressjs.com/) for web server utilities.
- [Pug](https://pugjs.org/) for rendering server-side templates.
- [MongoDB](https://www.mongodb.com/) to offer a NoSQL database.
- [Mongoose](https://mongoosejs.com/) for object data modeling and DB operations.
- [Passport.js](http://www.passportjs.org/) for user authentication strategies.
- [bcrypt](https://www.npmjs.com/package/bcrypt) for secure password hashing.
- [dotenv](https://www.npmjs.com/package/dotenv) for environment variable management.

## Features

1. **Secure Sign-up/Login**: User registration fortified with bcrypt encryption and Passport.js authentication.
2. **Member Exclusivity**: Only members get to view author details and timestamps of messages.
3. **Message Posting**: Any registered user can post messages, but only members see the full details.
4. **Admin Privileges**: Admins have a higher authority to manage posts and view all details.
5. **Club Membership**: A secret passcode page ensures exclusivity for members.
6. **Dynamic Visibility**: Content visibility adjusts based on user roles (visitor, member, admin).

---
