# Leave-Tracker-App
Leave Tracker is a SAAS application designed to simplify leave management for organizations. It provides a user-friendly interface for employees to request leave and for managers to approve or deny those requests. The application is built using modern technologies to ensure performance, scalability, and a seamless user experience.

# Features

- Leave Request Management: Employees can easily request leave through the application.
- Approval Workflow: Managers can approve or deny leave requests with a simple interface.
- Dashboard: Customized Tailwind dashboard for a visually appealing and responsive user interface.
- Scalable Backend: Powered by NodeJS for efficient server-side operations.
- Secure Database: MongoDB ensures data is securely stored and easily manageable.

# Tech Stack

Frontend: Vite React, Tailwind CSS
Backend: NodeJS
Database: MongoDB

# Installation

Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- MongoDB


# Steps

1. Clone the repository:
```
git clone https://github.com/your-repo/leave-tracker.git
cd leave-tracker
cd frontend
```

2. Install dependencies:
```
npm install
```
3. Set up environment variables:

Create a .env file in the root directory and add the necessary environment variables.
```
VITE_BASE_URL=http://localhost:3000
```

4. Start the development server:
```
npm run dev
```

5. Open another Tab on the Terminal
```
cd backend
```

6. Install dependencies
```
npm install
```

7. Set up environment variables:

Create a .env file in the root directory and add the necessary environment variables.
```
MONGODB_URI=your_mongodb_connection_string
```

8. Start the development server
```
nodemon server
```


# Usage

Access the application:
Open your browser and navigate to http://localhost:3000.

Login:
Use your credentials to log in to the application.

Request Leave:
Employees can request leave by navigating to the leave request section.

Approve/Deny Leave:
Managers can approve or deny leave requests from the dashboard.


# License
This project is licensed under the MIT License. See the LICENSE file for more details.
