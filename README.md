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

First, go to backend/ and run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000/api/employees](http://localhost:3000/api/employees) with your browser to see the result.

To view and edit the database using a pleasant, easy-to-use UI, run frontend/index.html:

```bash
open frontend/index.html
```