# CRUD Employee Management System

This project is a full-stack CRUD (Create, Read, Update, Delete) Employee Management System. It allows users to manage employee details through an intuitive web interface, providing functionalities for adding new employees, viewing the entire roster, editing individual entries, and performing bulk operations like updates and deletions, along with robust filtering capabilities.  

The backend is built with **Next.js API Routes** and connects to a **MongoDB** database, while the frontend is a standalone **HTML, CSS, and JavaScript** application.

## Features

This application offers a comprehensive set of features for efficient employee management:

* **Create Employee:** Add new employee records with details like Name, Email, Department, and Position.
* **View Employees:** Display a paginated/scrollable list of all employees in a clear table format.
* **Edit Employee:** Update individual employee details through a dedicated edit modal.
* **Delete Employee:** Remove individual employee records with a confirmation prompt.
* **Bulk Edit:** Select multiple employees and update their Department and/or Position simultaneously.
* **Bulk Delete:** Select multiple employees and delete them all at once with a confirmation.
* **Filter Employees:** Easily search and filter employees by Name or Department.
* **Responsive Design:** A user-friendly interface that adapts to various screen sizes.
* **Confirmation Modals:** Interactive modals for critical actions like delete and bulk operations to prevent accidental data loss.
* **Success Notifications:** Clear messages to confirm successful operations.

## Tech Stack

This project leverages a modern and robust technology stack:

* **Frontend:**
    * **HTML5:** Structure of the web application.
    * **CSS3:** Styling and visual design.
    * **JavaScript (ES6+):** Dynamic functionality and DOM manipulation.
* **Backend:**
    * **Next.js (API Routes):** React framework for building server-side logic and API endpoints.
    * **Node.js:** JavaScript runtime environment.
    * **Mongoose:** MongoDB object data modeling (ODM) for Node.js, simplifying database interactions.
    * **MongoDB Atlas:** Cloud-hosted NoSQL database for storing employee data.
* **Development Tools:**
    * **npm:** Package managers.
    * **TypeScript:** For enhanced code quality.

## Project Structure

```
├── backend/
│   ├── .next/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   └── employees/
│   │   │   │       ├── [id]/
│   │   │   │       │   └── route.ts        
│   │   │   │       ├── bulk-delete/
│   │   │   │       │   └── route.ts         
│   │   │   │       ├── bulk-update/
│   │   │   │       │   └── route.ts         
│   │   │   │       └── route.ts             
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── lib/
│   │   │   └── mongodb.ts                   
│   │   └── models/
│   │       └── employees.ts                
│   ├── .env.local
│   ├── .gitignore
│   ├── next-env.d.ts
│   ├── next.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.mjs
│   ├── README.md                            
│   └── tsconfig.json
├── frontend/
│   ├── index.html                          
│   ├── style.css                            
│   └── script.js   
├── ui/                      
├── .gitmodules                               
└── README.md                               
```

## Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

* Node.js (LTS version recommended)
* npm, yarn, pnpm, or bun (your preferred package manager)
* A MongoDB Atlas account (or a local MongoDB instance) with a database and collection set up. You'll need your MongoDB connection URI.

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment Variables:**
    Create a `.env.local` file in the `backend/` directory and add your MongoDB connection URI:
    ```
    MONGODB_URI=your_mongodb_connection_string
    ```
    *Replace `your_mongodb_connection_string` with your actual MongoDB URI (e.g., from MongoDB Atlas).*
4.  **Run the Backend Development Server:**
    ```bash
    npm run dev
    ```
    The backend API will be running at `http://localhost:3000`. Your API endpoints will be accessible under `http://localhost:3000/api/employees`.

### Frontend Setup

The frontend is a static HTML/CSS/JS application and doesn't require a separate server or build process.

1.  **Navigate to the frontend directory (from the project root):**
    ```bash
    cd frontend
    ```
2.  **Open `index.html` in your browser:**
    ```bash
    # On macOS
    open index.html
    # On Windows
    start index.html
    ```
    The frontend UI will load, interacting with the backend running at `http://localhost:3000`.