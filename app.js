// app.js
// ─────────────────────────────────────────────
//  IronForge Gym Management System
//  Main Express application entry point
// ─────────────────────────────────────────────

// ── Load environment variables first (before anything else) ──
require('dotenv').config();

// ── Core dependencies ─────────────────────────────────────────
const express        = require('express');
const session        = require('express-session');
const bcrypt         = require('bcrypt');
const morgan         = require('morgan');
const methodOverride = require('method-override');
const flash          = require('connect-flash');
const path           = require('path');

// ── Internal modules ──────────────────────────────────────────
const db = require('./config/db'); // MySQL pool — imported to test connection on startup
const authRoutes = require('./routes/authRoutes');
const memberRoutes = require('./routes/memberRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const reportRoutes = require('./routes/reportRoutes');
const reportController = require('./controllers/reportController');
const { requireAuth } = require('./middleware/authMiddleware');

// ── Create Express app ────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 3000;


// ════════════════════════════════════════════════════════════════
//  VIEW ENGINE — EJS
//  EJS lets you write normal HTML with <%= %> tags to inject
//  server data. All .ejs files live inside /views.
// ════════════════════════════════════════════════════════════════
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// ════════════════════════════════════════════════════════════════
//  STATIC FILES
//  Everything in /public is served directly by Express.
//  Your CSS, JS, and images all live here.
//
//  Folder layout:
//    /public/css/main.css   →  accessible at /css/main.css
//    /public/js/main.js     →  accessible at /js/main.js
//    /public/images/        →  accessible at /images/...
// ════════════════════════════════════════════════════════════════
app.use(express.static(path.join(__dirname, 'public')));


// ════════════════════════════════════════════════════════════════
//  REQUEST PARSING MIDDLEWARE
//  These two lines let Express read form data and JSON bodies.
// ════════════════════════════════════════════════════════════════
app.use(express.urlencoded({ extended: true }));  // HTML form POST data
app.use(express.json());                           // JSON API bodies


// ════════════════════════════════════════════════════════════════
//  METHOD OVERRIDE
//  HTML forms only support GET and POST.
//  method-override lets us fake PUT and DELETE by adding
//  ?_method=DELETE to a form action URL.
// ════════════════════════════════════════════════════════════════
app.use(methodOverride('_method'));


// ════════════════════════════════════════════════════════════════
//  LOGGING — morgan
//  Prints every HTTP request to the terminal in development.
//  e.g.  GET /dashboard 200 12.345 ms
// ════════════════════════════════════════════════════════════════
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


// ════════════════════════════════════════════════════════════════
//  SESSION
//  Stores login state server-side.
//  req.session.user will hold the logged-in admin's info.
// ════════════════════════════════════════════════════════════════
app.use(session({
  secret:            process.env.SESSION_SECRET || 'ironforge_secret',
  resave:            false,   // don't save session if nothing changed
  saveUninitialized: false,   // don't save empty sessions
  cookie: {
    secure:   false,          // set to true if using HTTPS in production
    httpOnly: true,           // JS cannot access the cookie — more secure
    maxAge:   parseInt(process.env.SESSION_MAX_AGE) || 86400000 // 24h in ms
  }
}));


// ════════════════════════════════════════════════════════════════
//  FLASH MESSAGES — connect-flash
//  One-time messages that survive a redirect.
//  Use req.flash('success', 'Member added!') before redirecting,
//  then read messages.success in the next page's template.
// ════════════════════════════════════════════════════════════════
app.use(flash());


// ════════════════════════════════════════════════════════════════
//  GLOBAL TEMPLATE LOCALS
//  Any value set on res.locals is automatically available in
//  every EJS template — no need to pass it manually each time.
// ════════════════════════════════════════════════════════════════
app.use((req, res, next) => {
  res.locals.user            = req.session.user || null;
  res.locals.successMessages = req.flash('success');
  res.locals.errorMessages   = req.flash('error');
  next();
});


// ════════════════════════════════════════════════════════════════
//  ROUTES
// ════════════════════════════════════════════════════════════════

// Authentication routes
app.use('/', authRoutes);

// Member routes
app.use('/members', memberRoutes);

// Trainer routes
app.use('/trainers', trainerRoutes);

// Membership routes
app.use('/memberships', membershipRoutes);

// Payment routes
app.use('/payments', paymentRoutes);

// Attendance routes
app.use('/attendance', attendanceRoutes);

// Reports routes
app.use('/reports', reportRoutes);

// Dashboard — protected
app.get('/dashboard', requireAuth, (req, res) => {
    reportController.getDashboardPage(req, res);
});

// Placeholder for all other pages (swap for real route files later)
const pages = [
  'members',
  'add-member',
  'trainers',
  'memberships',
  'attendance',
  'payments',
  'settings'
];

pages.forEach((page) => {
  app.get(`/${page}`, requireAuth, (req, res) => {
    res.render(page, {
      title: `${page.charAt(0).toUpperCase() + page.slice(1)} — IronForge GMS`
    });
  });
});


// ════════════════════════════════════════════════════════════════
//  404 HANDLER
//  Any request that didn't match a route above lands here.
// ════════════════════════════════════════════════════════════════
app.use((req, res) => {
  res.status(404).render('404', {
    title:   '404 — Page Not Found',
    message: `The page "${req.originalUrl}" does not exist.`
  });
});


// ════════════════════════════════════════════════════════════════
//  GLOBAL ERROR HANDLER
//  Any unhandled error passed to next(err) lands here.
//  In production this prevents stack traces leaking to the browser.
// ════════════════════════════════════════════════════════════════
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);

  const status  = err.status || 500;
  const message = process.env.NODE_ENV === 'development'
    ? err.message
    : 'Something went wrong. Please try again.';

  res.status(status).render('error', {
    title:   `Error ${status}`,
    message: message
  });
});


// ════════════════════════════════════════════════════════════════
//  START SERVER
// ════════════════════════════════════════════════════════════════
app.listen(PORT, () => {
  console.log('');
  console.log('  ██╗██████╗  ██████╗ ███╗  ██╗');
  console.log('  ██║██╔══██╗██╔═══██╗████╗ ██║');
  console.log('  ██║██████╔╝██║   ██║██╔██╗██║');
  console.log('  ██║██╔══██╗██║   ██║██║╚████║');
  console.log('  ██║██║  ██║╚██████╔╝██║ ╚███║');
  console.log('  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚══╝');
  console.log('');
  console.log(`  🏋️  IronForge GMS running on http://localhost:${PORT}`);
  console.log(`  🌍  Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(`  🗄️  Database    : ${process.env.DB_NAME}@${process.env.DB_HOST}`);
  console.log('');
});

module.exports = app;
