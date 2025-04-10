# Firebase Setup Instructions for BabesLove

This guide will help you set up Firebase for your BabesLove e-commerce project. Firebase provides authentication, database, storage, and hosting services.

## Prerequisites

- A Google account
- Node.js and npm installed
- The BabesLove project code

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter "BabesLove" as the project name
4. Enable Google Analytics (recommended)
5. Choose your Google Analytics account or create a new one
6. Click "Create project"

## Step 2: Register Your Web App

1. From the Firebase project dashboard, click the web icon (</>) to add a web app
2. Name your app "BabesLove Web"
3. Check the "Also set up Firebase Hosting" option if you plan to use Firebase hosting
4. Click "Register app"
5. Copy the Firebase configuration object shown on the screen

## Step 3: Set Up Environment Variables

Create or update your `.env.local` file in the frontend directory with the Firebase configuration:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## Step 4: Enable Firebase Services

### Authentication

1. In the Firebase console, go to "Authentication"
2. Click "Get started"
3. Enable Email/Password authentication
4. (Optional) Enable Google authentication if you want to support social login

### Firestore Database

1. In the Firebase console, go to "Firestore Database"
2. Click "Create database"
3. Start in test mode (we'll set up security rules later)
4. Choose a database location closest to your users
5. Click "Enable"

### Storage

1. In the Firebase console, go to "Storage"
2. Click "Get started"
3. Start in test mode (we'll set up security rules later)
4. Click "Next"
5. Choose a storage location closest to your users
6. Click "Done"

## Step 5: Set Up Security Rules

### Firestore Rules

Go to "Firestore Database" > "Rules" and update with these basic rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to products
    match /products/{product} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    // User profiles can only be read/written by the owner
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Cart items can only be read/written by the owner
    match /carts/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Orders can be created by authenticated users, but only read/modified by the owner or admin
    match /orders/{orderId} {
      allow create: if request.auth != null;
      allow read, update: if request.auth != null &&
                           (request.auth.uid == resource.data.userId ||
                            request.auth.token.admin == true);
    }
  }
}
```

### Storage Rules

Go to "Storage" > "Rules" and update with these basic rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow public read access to product images
    match /products/{productId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    // User profile images can only be read/written by the owner
    match /users/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 6: Set Up Admin Users

To give admin privileges to users:

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize Cloud Functions: `firebase init functions`
4. Create a custom function to set admin claims for specific users
5. Deploy the function: `firebase deploy --only functions`

## Step 7: Test Your Setup

1. Start your application: `npm run dev`
2. Test user registration and login
3. Test product display, cart functionality, and order placement
4. Test admin functions if applicable

## Troubleshooting

If you encounter issues:

1. Check your Firebase configuration values
2. Ensure all required Firebase services are enabled
3. Check browser console for errors
4. Verify security rules are properly configured

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Storage](https://firebase.google.com/docs/storage)
