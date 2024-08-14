# HiBuddy Chat Application

HiBuddy is a real-time chat application built with React and Vite. 

It features a modern user interface, emoji support, and real-time messaging capabilities using Socket.io.

While in local videos are perfectly transmitted, but because of free instances this may cause time out from the server but Images, Documents and Messages are stored in the database and retrieved perfectly

Different DB storage done in MongoDB for Direct chat messages and Group chat messages,

So Two different Components structure used for these chat types. 

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- Real-time messaging with Socket.io
- Emoji support using emoji-picker-react
- Images and Documents Shared and stored as URL in DB and file in Cloudinary
- User authentication and persistent state management with Redux Toolkit and Redux Persist
- Responsive design for both desktop and mobile devices
- File sharing capabilities
- User-friendly interface with React Icons

## Technologies/Dependencies Used

- reduxjs/toolkit
- axios
- react-router-dom
- redux-persist
- socket.io-client

## Installation

To get started with HiBuddy, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Rajganez/chat-application-frontend.git
   cd chat-application-frontend
   npm install
   ```

2. **Usage:**

   To start the development server:

   ```bash
   npm run dev
   ```

   To build the application for production, run:

   ```bash
   npm run build
   ```

## Contributing

Contributions are welcome!

Fork the repository
Create your feature branch (git checkout -b feature/your-feature)
Commit your changes (git commit -m 'Add your feature')
Push to the branch (git push origin feature/your-feature)
Open a pull request
