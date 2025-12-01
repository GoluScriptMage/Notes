# CodeSync Project

A real-time communication app built with Node.js, Express, Socket.io, React, and Tailwind CSS 3.4.

## Project Structure

```
codesync-project/
├── server/              # Backend (Node.js + Socket.io)
│   ├── package.json
│   └── index.js
└── client/              # Frontend (React + Socket.io-client + Tailwind)
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── App.jsx
        ├── main.jsx
        └── index.css
```

## Setup Instructions

### Server Setup

```bash
cd server
npm install
npm run dev
```

Server will run on http://localhost:3001

### Client Setup

```bash
cd client
npm install
npm run dev
```

Client will run on http://localhost:5173

## Features

- Real-time bidirectional communication using Socket.io
- Modern React with Vite
- Tailwind CSS 3.4 for styling
- Simple chat interface to test Socket.io connection

## Usage

1. Start the server first
2. Start the client
3. Open multiple browser tabs to test real-time messaging
