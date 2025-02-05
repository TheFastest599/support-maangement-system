# Support Ticket System

This project is an internship assignment for building a Support Ticket System. It is built using NextUI, Vite, React, Firebase, and Firestore.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Firebase Configuration](#firebase-configuration)
- [Deployment](#deployment)
- [License](#license)

## Introduction

The Support Ticket System is a web application that allows users to create, manage, and track support tickets. It provides different dashboards for customers and support agents to handle tickets efficiently.

## Features

- User authentication and authorization
- Role-based access control (Customer and Agent)
- Create, view, edit, and delete support tickets
- Real-time updates using Firestore
- Responsive design with NextUI

## Technologies Used

- **React**: A JavaScript library for building user interfaces
- **Vite**: A fast build tool for modern web projects
- **NextUI**: A beautiful, modern, and responsive UI library
- **Firebase**: A platform for building web and mobile applications
- **Firestore**: A flexible, scalable database for real-time applications

## Getting Started

To get started with the project, follow these steps:

1. **Clone the repository**:

   ```sh
   git clone https://github.com/your-username/support-ticket-system.git
   cd support-ticket-system
   ```

2. **Install dependencies**:

   ```sh
   npm install
   ```

3. **Create a [.env](http://_vscodecontentref_/1) file** in the root of your project and add your Firebase configuration:

   ```plaintext
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

4. **Run the development server**:

   ```sh
   npm run dev
   ```

5. **Build for production**:
   ```sh
   npm run build
   ```

## Firebase Configuration

Ensure you have a Firebase project set up. Add your Firebase configuration to the [.env](http://_vscodecontentref_/2) file as shown above. The configuration should include the following keys:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

## Deployment

To deploy the project to Firebase Hosting, follow these steps:

1. **Install Firebase CLI**:

   ```sh
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:

   ```sh
   firebase login
   ```

3. **Initialize Firebase in your project**:

   ```sh
   firebase init
   ```

4. **Build your project**:

   ```sh
   npm run build
   ```

5. **Deploy to Firebase Hosting**:
   ```sh
   firebase deploy
   ```

## License

This project is licensed under the MIT License. See the LICENSE file for details.
