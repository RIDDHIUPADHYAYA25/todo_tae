The To-Do List Manager is a secure, multi-user web application designed to help individuals organize and track their daily tasks with ease. Built using Flask (Python) for the backend and HTML, CSS, and JavaScript for the frontend, the application offers a clean, card-based interface that enhances usability and visual clarity.
Users can register and log in to access their personalized dashboard, where they can:
- ➕ Add tasks with deadlines
- 📋 View tasks in a card-style layout
- 🔄 Update task status (Pending/Done)
- ❌ Delete tasks
- 📊 Monitor progress via a dynamic progress bar
- 🌙 Toggle between light and dark mode for accessibility
The backend uses SQLite with SQLAlchemy ORM to manage relational data, ensuring that each task is securely linked to its respective user. Passwords are hashed using Werkzeug for secure authentication, and session management ensures that users can only access their own data.
This project demonstrates key concepts in full-stack development:
- 🔐 User authentication and session handling
- 🧩 RESTful API integration
- 🎨 Responsive UI/UX design
- 🗃️ Relational database modeling
- ⚙️ Dynamic DOM manipulation
The application is modular, scalable, and ready for deployment, making it an ideal foundation for future enhancements such as calendar integration, notifications, or cloud-based storage.



