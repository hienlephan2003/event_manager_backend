# 🚀 Event Management API

## 📝 Overview
This project is an Event Management API built using Express and MongoDB. It allows managing events, adding events, booking tickets, and processing payments using Zalo Pay. Additionally, it utilizes seat.io for creating stages, providing event managers the ability to customize stages, and enabling users to book seats.

## 💻 Technologies Used
- Express.js
- MongoDB
- Zalo Pay Sandbox
- seat.io

## Frontend GitHub Link
- Explore the frontend repository [here](https://github.com/vocongbinh/event_manager).

## ✨ Features
- **Event Management**: Allows CRUD operations for managing events.
- **Booking System**: Users can book tickets for events and select seats.
- **Payment Integration**: Supports payment processing using Zalo Pay.
- **Customizable Stages**: Utilizes seat.io to create stages and customize seating arrangements.
- **Event Customization**: Provides event managers with the ability to customize stages for events.

## 🚀 Getting Started
1. **Prerequisites**: Make sure you have Node.js and MongoDB installed on your system.
2. **Clone the Repository**: `git clone https://github.com/hienlephan2003/event_manager_backend`
3. **Install Dependencies**: Run `npm install` to install project dependencies.
4. **Configure Environment Variables**: Set up environment variables, such as MongoDB connection string and Zalo Pay API keys.
5. **Start the Server**: Run `npm start` to start the Express server.
6. **Explore the API**: Use tools like Postman to explore and interact with the API endpoints.

## 🛠️ API Endpoints
- `/events`: CRUD operations for managing events.
- `/tickets`: Booking tickets for events.
- `/payment`: Processing payments using Zalo Pay.

## ⚙️ Configuration
- MongoDB Connection String: `MONGODB_URI`
- Zalo Pay API Keys: `ZALO_API_KEY`, `ZALO_SECRET_KEY`

## 📖 Usage
- Ensure proper authentication and authorization mechanisms are implemented for securing API endpoints.
- Provide clear documentation for API consumers regarding request and response formats.

## 🤝 Contribution
Contributions are welcome! Please follow the [Contribution Guidelines](CONTRIBUTING.md).

## 📝 License
This project is licensed under the [MIT License](LICENSE).
