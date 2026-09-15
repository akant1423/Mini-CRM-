# Mini CRM - Client Lead Management System

A full-stack Client Lead Management System built using React, Node.js, Express, and MongoDB.

## Features

- Contact form for submitting leads
- MongoDB database integration
- Admin dashboard
- View all leads
- Search leads
- Lead status management
- Status options:
  - New
  - Contacted
  - Converted
  - Lost
- Follow-up notes
- Add new leads from admin dashboard
- View detailed lead information
- Delete leads
- Export leads as CSV
- Dashboard statistics
- Responsive design

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- HTML
- CSS

### Backend
- Node.js
- Express.js
- Mongoose
- MongoDB Atlas

## Project Structure

```text
Mini-CRM-
│
├── backend/
│   ├── models/
│   │   └── Lead.js
│   ├── routes/
│   │   └── leadRoutes.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── App.css
│   │   ├── AdminDashboard.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── .gitignore
