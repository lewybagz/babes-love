# Babes Love E-Commerce Platform (Admin Guide)

## Introduction

Welcome to the Babes Love store management system! This guide is for the admin team to understand the project and how to get it running on your computers. This system was developed by Lewy to help manage our online store for handcrafted hats and apparel.

It includes:

1.  The **Storefront**: The public website that customers visit to browse and buy products.
2.  The **Admin Dashboard**: A private area for our team to manage products, orders, customers, marketing, and see how the store is performing.

## Project Overview

Think of the project like a restaurant:

1.  **Frontend (The Dining Area & Menu):**

    - This is the actual website (`/frontend` folder in the code).
    - It's what customers see and interact with – the homepage, product pages, shopping cart, etc.
    - It's built to look good and be easy to use.
    - It also includes the **Admin Dashboard** interface you'll use.

2.  **Backend (The Kitchen & Office):**
    - This is the hidden part that makes everything work (`/backend` folder in the code).
    - It handles storing data (products, orders, customer info), processing payments (though actual processing is via Stripe/etc.), and managing the logic behind the scenes.
    - You won't directly see this part, but the Admin Dashboard talks to it constantly

## Key Admin Features

The Admin Dashboard allows you to:

- **View Dashboard Overview:** Get a quick snapshot of key store information.
- **Manage Products:** Add new products, edit existing ones (update names, prices, descriptions, images), and mark them as available or unavailable.
- **Manage Orders:** View incoming customer orders, check their details, and update their status (e.g., from 'Processing' to 'Shipped').
- **Manage Customers:** (Coming Soon) View customer information and order history.
- **View Payments:** (Coming Soon) See a history of transactions.
- **Analytics:** View charts and reports on sales performance, customer activity, and top products.
- **Manage Marketing Campaigns:** Create, view, edit, and delete marketing campaigns (like sales or promotions). View analytics on campaign performance.
- **Configure Settings:** (Coming Soon) Adjust store-wide settings.

## Getting Started (Running the Project Locally)

To run the store and admin dashboard on your own computer (e.g., for testing or content updates), follow these steps. You might need Lewy's help the first time.

**Prerequisites:**

- **Node.js and npm:** This is a technical tool needed to run the project. Lewy can help ensure it's installed on your machine.

**Setup Steps:**

1.  **Get the Code:** Make sure you have the latest project code, likely through GitHub Desktop or by asking Lewy.
2.  **Configuration Files (IMPORTANT):** This project needs specific secret files to connect to services like databases or payment systems. These are **not** stored in the main codebase for security.
    - Ask Lewy for the `serviceAccountKey.json` file needed for the backend. Place it inside the `/backend` folder.
    - Ask Lewy for the `.env` file needed for the `/backend` folder. This contains secret keys.
    - Ask Lewy for the `.env` file needed for the `/frontend` folder. This might contain different keys for the website part.
    - _(Note: There might be `.env.example` files included as templates, but you need the actual `.env` files with the real keys from Lewy)._
3.  **Install Dependencies (Software Libraries):** You need to do this for _both_ the frontend and backend separately. Open a terminal or command prompt window:
    - Navigate to the backend folder: `cd path\to\project\babeslove\backend` (Replace `path\to\project` with the actual path on your computer)
    - Run: `npm install`
    - Navigate to the frontend folder: `cd ..\frontend` (Goes up one level and then into frontend)
    - Run: `npm install`

**Running the Project:**

You need to start _both_ the backend and the frontend separately. This requires **two** terminal/command prompt windows.

1.  **Start the Backend:**

    - In one terminal window, navigate to the backend folder: `cd path\to\project\babeslove\backend`
    - Run: `npm start` (or `npm run dev` if Lewy specifies)
    - Leave this window running. You'll see log messages.

2.  **Start the Frontend:**

    - Open a **second** terminal window.
    - Navigate to the frontend folder: `cd path\to\project\babeslove\frontend`
    - Run: `npm run dev`
    - This will usually output a local web address.

3.  **Access the Store/Admin:**
    - Open your web browser (like Chrome or Edge).
    - Go to the address shown by the frontend terminal – usually `http://localhost:5173`.
    - You should see the storefront.
    - To access the admin dashboard, log in with an admin account (ask Lewy for details) and navigate to `/admin` (i.e., `http://localhost:5173/admin`).

## Important Configuration Files (`.env`, `serviceAccountKey.json`)

- These files contain sensitive information like API keys (passwords for services), database connections, and secret credentials.
- **Never share these files publicly or commit them to GitHub.** The `.gitignore` file (configured by Lewy) helps prevent accidental commits.
- If you need to run the project, always get the latest, correct versions of these files directly from Lewy.

## Need Help?

If you encounter any issues with setup, running the project, or understanding features, please contact **Lewy**.
