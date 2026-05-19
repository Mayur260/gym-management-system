/* ============================================================
   GYM MANAGEMENT SYSTEM — SIDEBAR & TOPBAR INJECTION
   ============================================================ */

const GYM_NAV = [
  {
    section: 'Main',
    items: [
      { label: 'Dashboard',   page: '/dashboard',     icon: iconGrid(),     badge: '' },
      { label: 'Members',     page: '/members',       icon: iconUsers(),    badge: '10' },
      { label: 'Trainers',    page: '/trainers',      icon: iconDumbbell(), badge: '' },
      { label: 'Memberships', page: '/memberships',   icon: iconCard(),     badge: '' },
    ]
  },
  {
    section: 'Operations',
    items: [
      { label: 'Attendance', page: '/attendance', icon: iconCalendar(), badge: '' },
      { label: 'Payments',   page: '/payments',   icon: iconCash(),     badge: '5' },
      { label: 'Reports',    page: '/reports',    icon: iconChart(),    badge: '' },
    ]
  },
  {
    section: 'Account',
    items: [
      { label: 'Settings', page: '/settings', icon: iconSettings(), badge: '' },
    ]
  }
];

function buildSidebar(pageTitle) {
  const currentPath = window.location.pathname;

  const navHtml = GYM_NAV.map(group => `
    <div class="nav-section-label">${group.section}</div>
    ${group.items.map(item => `
      <a href="${item.page}" class="nav-item ${currentPath === item.page ? 'active' : ''}" data-page="${item.page}">
        ${item.icon}
        <span>${item.label}</span>
        ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
      </a>
    `).join('')}
  `).join('');

  const sidebar = `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="white">
            <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
          </svg>
        </div>
        <div>
          <div class="logo-text">IronForge</div>
          <div class="logo-sub">Gym Management</div>
        </div>
      </div>
      <nav class="sidebar-nav">${navHtml}</nav>
      <div class="sidebar-footer">
        <a href="/settings" class="sidebar-user">
          <div class="user-avatar-sm">AR</div>
          <div class="user-info-sm">
            <div class="user-name-sm">Admin Ravi</div>
            <div class="user-role-sm">Super Admin</div>
          </div>
        </a>
        <a href="/logout" class="nav-item mt-2" style="color:var(--danger);margin-top:6px;">
          ${iconLogout()}
          <span>Logout</span>
        </a>
      </div>
    </aside>
    <div class="sidebar-overlay" id="sidebarOverlay"></div>
  `;

  const topbar = `
    <header class="topbar">
      <button class="topbar-hamburger icon-btn" id="hamburger" aria-label="Menu">
        <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
          <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
        </svg>
      </button>
      <span class="topbar-title">${pageTitle}</span>
      <div class="topbar-actions">
        <button class="icon-btn" title="Notifications">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/></svg>
          <span class="notif-dot"></span>
        </button>
        <a href="/settings" class="topbar-avatar" title="Profile">AR</a>
      </div>
    </header>
  `;

  document.getElementById('sidebar-slot').outerHTML = sidebar;
  document.getElementById('topbar-slot').outerHTML = topbar;

  initSidebar();
}

/* ─── ICON HELPERS ──────────────────────────────────────── */
function iconGrid() { return `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 8a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zm6-6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>`; }
function iconUsers() { return `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>`; }
function iconDumbbell() { return `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>`; }
function iconCard() { return `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/><path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd"/></svg>`; }
function iconCalendar() { return `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/></svg>`; }
function iconCash() { return `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>`; }
function iconChart() { return `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>`; }
function iconSettings() { return `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/></svg>`; }
function iconLogout() { return `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"/></svg>`; }
