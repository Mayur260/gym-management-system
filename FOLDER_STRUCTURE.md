# Gym Management System - Folder Structure

## Project Organization

```
gym-management/
│
├── app.js                          # Main Express application entry point
├── package.json                    # Project dependencies and metadata
├── package-lock.json               # Locked dependency versions
├── .env                            # Environment variables (development)
├── .env.example                    # Environment variables template
├── gym_management.sql              # Database schema and initial data
│
├── /config
│   └── db.js                       # Database connection configuration
│
├── /public                         # Static assets (served by Express)
│   ├── /css
│   │   └── main.css                # Main stylesheet
│   │
│   ├── /js
│   │   ├── main.js                 # Shared JavaScript utilities
│   │   └── nav.js                  # Navigation and sidebar logic
│   │
│   └── /images                     # Image assets (PNG, JPG, SVG, etc.)
│
├── /views                          # EJS Template files
│   ├── index.ejs                   # Login/home page
│   ├── dashboard.ejs               # Main dashboard
│   ├── members.ejs                 # Members management
│   ├── add-member.ejs              # Add new member form
│   ├── trainers.ejs                # Trainers management
│   ├── memberships.ejs             # Membership plans
│   ├── attendance.ejs              # Attendance tracking
│   ├── payments.ejs                # Payment tracking
│   ├── reports.ejs                 # Reports and analytics
│   ├── settings.ejs                # User settings
│   │
│   └── /partials                   # Reusable template components
│       ├── navbar.ejs              # Top navigation bar
│       ├── sidebar.ejs             # Sidebar navigation
│       └── footer.ejs              # Footer component
│
├── /routes                         # API/Page route handlers
│   └── index.js                    # Main routes
│
├── /controllers                    # Business logic layer
│   └── index.js                    # Main controller logic
│
├── /models                         # Database models and queries
│   └── index.js                    # Data access layer
│
├── /logs                           # Application logs
│
└── /node_modules                   # Installed dependencies (npm packages)

```

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database and server settings
   ```

3. **Setup Database**
   ```bash
   # Import gym_management.sql into your MySQL database
   mysql -u root -p gym_management < gym_management.sql
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Access Application**
   - Open http://localhost:3000 in your browser

## Development Notes

- **Views**: All frontend templates are in /views using EJS
- **Static Files**: CSS and JS are served from /public
- **Database**: Configure MySQL connection in .env and config/db.js
- **Routes**: Add new routes in /routes directory
- **Controllers**: Business logic goes in /controllers
- **Models**: Database queries in /models

## File Naming Conventions

- Routes: `camelCase` (e.g., memberRoutes.js)
- Controllers: `camelCase` (e.g., memberController.js)
- Models: `PascalCase` (e.g., Member.js)
- Views: `kebab-case` (e.g., add-member.ejs)
- Partials: `kebab-case` (e.g., navbar.ejs)
