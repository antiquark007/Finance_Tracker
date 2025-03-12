
# Personal Finance Tracker

A web application for tracking personal finances with React, shadcn/ui, and MongoDB.

## Setup Instructions

### Frontend
1. Install dependencies:
```
npm install
```

2. Create a `.env` file in the root directory with the following content:
```
VITE_API_URL=http://localhost:3000/api
```

3. Start the development server:
```
npm run dev
```

### Backend
1. Navigate to the server directory:
```
cd server
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file in the server directory with the following content:
```
MONGODB_URI=mongodb://localhost:27017/finance-tracker
PORT=3000
```

4. Start the server:
```
npm start
```

## Features
- Add, edit, and delete financial transactions
- View transactions in a list
- Visualize monthly income and expenses
- Data is stored in MongoDB database

## Technologies Used
- React
- shadcn/ui
- Recharts for data visualization
- MongoDB for data storage
- Express for the backend API
