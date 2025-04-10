# BabesLove Backend - Firebase Support Services

This is a streamlined backend for the BabesLove e-commerce platform, designed to work with Firebase. Most functionality has been migrated to Firebase (Authentication, Firestore Database, and Storage), but this backend provides additional services that are better suited for server-side implementations.

## Current Functionality

This backend now serves as a supplementary service for operations that still benefit from server-side processing:

1. **Tax Calculation Services**: Simplified fixed tax rate of 7.43% for all transactions
2. **Firebase Admin SDK Operations**: Server-side Firebase operations requiring admin privileges

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- A Firebase project with Firestore and Authentication enabled
- Firebase service account key

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up your environment variables:
   ```
   cp .env.example .env
   ```
4. Add your Firebase service account key to the project:
   - Download your Firebase service account key (JSON) from the Firebase Console
   - Save it as `serviceAccountKey.json` in the root of the backend directory

### Configuration

Edit the `.env` file and update the following values:

- `FIREBASE_DATABASE_URL`: Your Firebase database URL
- `FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
- `FIXED_TAX_RATE`: The fixed tax rate (default is 0.0743 or 7.43%)
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret

### Running the Server

Development mode with hot reload:

```
npm run dev
```

Production mode:

```
npm start
```

## Tax Calculation with Fixed Rate

The backend uses a simplified tax calculation with a fixed 7.43% rate for all transactions:

- `POST /api/tax/calculate`: Calculate tax for an order (requires only item information)
- `GET /api/tax/rates`: Get the fixed tax rate

Benefits of this approach:

- Simplicity and predictability
- No external API dependencies
- Consistent tax calculations across all orders
- Reduced complexity in code maintenance

## Firebase Admin Operations

The backend includes the Firebase Admin SDK, which enables server-side operations like:

- Setting custom claims (user roles)
- Batch operations on Firestore
- Server-side data validation
- Administrative functions that shouldn't be performed from the client

## Deployment

The backend can be deployed to any Node.js hosting service. For production, consider:

- Vercel
- Heroku
- Google Cloud Run
- AWS Elastic Beanstalk

## Development Notes

- This backend has been significantly simplified from the original version, as most functionality now resides in Firebase
- The server is designed to be minimal and focused on specific tasks
- MongoDB has been completely removed in favor of Firestore
- Tax calculations use a single fixed rate for all transactions
