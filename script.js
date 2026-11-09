/**
 * PARK-O-BUDDY - UNIFIED INTERACTIVE JAVASCRIPT (script.js)
 * Architecture & Modules:
 *   - StorageManager: Centralized mock database & localStorage sync
 *   - Shreya: Home page search routing, navbar session handling, footer integration
 *   - Avika: Parking search, multi-filter criteria, dynamic sorting, interactive map
 *   - Yashika: Form validation, auth role/tab switcher, 5-tab dashboard interactions
 *   - Mehak: Host multi-step listing, validation, earnings estimator, about FAQs
 *   - Nandini: Slot matrix selection, dynamic pricing engine, booking confirmation
 */

/* ==========================================================================
   1. CENTRALIZED STORAGE MANAGER (MOCK DATABASE & STATE)
   ========================================================================== */
const StorageManager = {
  // Default Pre-loaded Parking Spots
  defaultSpots: [
    {
      id: "1",
      slug: "green-view",
      title: "Green View Parking",
      location: "Cyber City Block A, Cyber City Phase 2",
      city: "Gurugram",
      price: 40,
      distance: 0.3,
      rating: 4.8,
      reviewsCount: 124,
      covered: true,
      ev: false,
      cctv: true,
      security: true,
      valet: false,
      vehicleTypes: ["car", "suv", "bike"],
      host: "Ramesh K.",
      icon: "🅿️",
      mapCoordinates: { top: "35%", left: "45%" }
    },
    {
      id: "2",
      slug: "metro-mall",
      title: "Metro Mall Basement Spot",
      location: "Metro Mall Gate 3, MG Road",
      city: "Gurugram",
      price: 30,
      distance: 0.5,
      rating: 4.6,
      reviewsCount: 89,
      covered: true,
      ev: true,
      cctv: true,
      security: true,
      valet: true,
      vehicleTypes: ["car", "suv"],
      host: "Metro Retail Corp",
      icon: "🏬",
      mapCoordinates: { top: "25%", left: "70%" }
    },
    {
      id: "3",
      slug: "tech-park",
      title: "Tech Park Executive Garage",
      location: "Tech Park Plaza, Sector 44",
      city: "Gurugram",
      price: 50,
      distance: 0.1,
      rating: 4.9,
      reviewsCount: 210,
      covered: true,
      ev: true,
      cctv: true,
      security: true,
      valet: false,
      vehicleTypes: ["car", "suv", "bike"],
      host: "DLF Estates",
      icon: "🏢",
      mapCoordinates: { top: "68%", left: "35%" }
    },
    {
      id: "4",
      slug: "connaught-bay",
      title: "Connaught Central Covered Bay",
      location: "Inner Circle, Connaught Place",
      city: "New Delhi",
      price: 60,
      distance: 0.2,
      rating: 4.7,
      reviewsCount: 156,
      covered: true,
      ev: false,
      cctv: true,
      security: true,
      valet: true,
      vehicleTypes: ["car", "bike"],
      host: "Vikram Malhotra",
      icon: "🏛️",
      mapCoordinates: { top: "50%", left: "55%" }
    },
    {
      id: "5",
      slug: "aerocity-express",
      title: "Aerocity FastPark Terminal 3",
      location: "Hospitality District, Aerocity",
      city: "New Delhi",
      price: 75,
      distance: 0.8,
      rating: 4.9,
      reviewsCount: 340,
      covered: true,
      ev: true,
      cctv: true,
      security: true,
      valet: true,
      vehicleTypes: ["car", "suv"],
      host: "GMR Aero Hub",
      icon: "✈️",
      mapCoordinates: { top: "78%", left: "65%" }
    }
  ],

  // Get all spots (default + user submitted from host page)
  getAllSpots() {
    try {
      const custom = JSON.parse(localStorage.getItem('pob_custom_spots') || '[]');
      return [...this.defaultSpots, ...custom];
    } catch (e) {
      return this.defaultSpots;
    }
  },

  // Save new host listing
  addCustomSpot(spot) {
    const custom = JSON.parse(localStorage.getItem('pob_custom_spots') || '[]');
    custom.unshift(spot);
    localStorage.setItem('pob_custom_spots', JSON.stringify(custom));
  },

  // User Profile
  getUser() {
    try {
      const user = localStorage.getItem('pob_user');
      if (user) return JSON.parse(user);
    } catch (e) {}
    // Default initial user session
    return {
      name: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "+91 98765 43210",
      role: "parker",
      walletBalance: 450,
      isLoggedIn: true
    };
  },

  setUser(user) {
    localStorage.setItem('pob_user', JSON.stringify(user));
  },

  // Bookings
  getActiveBooking() {
    try {
      const b = localStorage.getItem('pob_active_booking');
      if (b) return JSON.parse(b);
    } catch (e) {}
    // Default mock active booking
    return {
      id: "POB-99824",
      spotTitle: "Green View Parking",
      spotLocation: "Cyber City Block A, Cyber City",
      slotNumber: "A3",
      vehiclePlate: "DL 03 CA 9081",
      vehicleType: "Car",
      date: "Today, 10 Sep",
      startTime: "09:00",
      endTime: "13:00",
      durationHours: 4,
      totalAmount: 175,
      status: "Active",
      createdAt: new Date().toISOString()
    };
  },

  setActiveBooking(booking) {
    localStorage.setItem('pob_active_booking', JSON.stringify(booking));
    // Also push to history
    this.addBookingToHistory(booking);
  },

  getBookingHistory() {
    try {
      const history = localStorage.getItem('pob_booking_history');
      if (history) return JSON.parse(history);
    } catch (e) {}
    return [
      {
        id: "POB-88310",
        spotTitle: "Metro Mall Gate 3 Basement",
        slotNumber: "B2",
        date: "04 Sep 2026, 14:00 - 18:00",
        totalAmount: 135,
        status: "Completed"
      },
      {
        id: "POB-74521",
        spotTitle: "Tech Park Executive Garage",
        slotNumber: "C5",
        date: "28 Aug 2026, 10:00 - 12:00",
        totalAmount: 115,
        status: "Completed"
      },
      {
        id: "POB-61092",
        spotTitle: "Connaught CP Private Bay",
        slotNumber: "D1",
        date: "15 Aug 2026, 17:00 - 21:00",
        totalAmount: 200,
        status: "Completed"
      }
    ];
  },

  addBookingToHistory(booking) {
    const list = this.getBookingHistory();
    list.unshift(booking);
    localStorage.setItem('pob_booking_history', JSON.stringify(list));
  },

  // Vehicles
  getVehicles() {
    try {
      const v = localStorage.getItem('pob_vehicles');
      if (v) return JSON.parse(v);
    } catch (e) {}
    return [
      { id: "v1", type: "Car", make: "Honda City", plate: "DL 03 CA 9081", isDefault: true },
      { id: "v2", type: "Bike", make: "Royal Enfield Classic 350", plate: "DL 05 XY 2341", isDefault: false }
    ];
  },

  saveVehicles(list) {
    localStorage.setItem('pob_vehicles', JSON.stringify(list));
  }
};

/* ==========================================================================
   2. GLOBAL UTILITIES (TOAST, NAVBAR SESSION, MOBILE MENU)
   ========================================================================== */
function showToast(message, type = 'info') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  toast.style.display = 'flex';

  if (window.toastTimer) clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.style.display = 'none';
  }, 3800);
}
window.showToast = showToast;

// Navbar Dynamic State & Session Synchronization (Shreya)
function setupNavbar() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const user = StorageManager.getUser();

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }

  // Update dynamic user info in navbar
  const navActions = document.querySelector('.nav-actions');
  if (navActions && user && user.isLoggedIn) {
    const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'US';
    navActions.innerHTML = `
      <a href="dashboard.html" class="user-nav-pill" title="Go to Dashboard">
        <div class="user-avatar-sm">${initials}</div>
        <span>${user.name.split(' ')[0]}</span>
      </a>
      <a href="auth.html" class="btn btn-outline btn-sm" onclick="logoutUser(event)">Log Out</a>
    `;
  }
}

window.logoutUser = function(e) {
  if (e) e.preventDefault();
  const user = StorageManager.getUser();
  user.isLoggedIn = false;
  StorageManager.setUser(user);
  showToast('Logged out successfully.', 'info');
  setTimeout(() => {
    window.location.href = 'auth.html';
  }, 800);
};

/* ==========================================================================
   3. SHREYA'S HOME PAGE MODULE (index.html)
   ========================================================================== */
function setupHomePage() {
  const homeSearchForm = document.getElementById('homeSearchForm');
  if (!homeSearchForm) return;

  homeSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const loc = document.getElementById('homeLocation')?.value.trim() || '';
    const date = document.getElementById('homeDate')?.value || '';
    const checkin = document.getElementById('homeCheckin')?.value || '';
    const checkout = document.getElementById('homeCheckout')?.value || '';
    const vehicle = document.getElementById('homeVehicle')?.value || 'car';

    const params = new URLSearchParams();
    if (loc) params.set('location', loc);
    if (date) params.set('date', date);
    if (checkin) params.set('checkin', checkin);
    if (checkout) params.set('checkout', checkout);
    if (vehicle) params.set('vehicle', vehicle);

    window.location.href = `search.html?${params.toString()}`;
  });

  // Floating map pin interactions on Hero
  const pins = document.querySelectorAll('.hero-mockup-card .map-pin');
  pins.forEach(pin => {
    pin.addEventListener('click', () => {
      pins.forEach(p => p.classList.remove('active'));
      pin.classList.add('active');
    });
  });
}

/* ==========================================================================
   4. AVIKA'S SEARCH & MAP MODULE (search.html)
   ========================================================================== */
function setupSearchPage() {
  const listingsContainer = document.getElementById('listingsContainer');
  if (!listingsContainer) return;

  const destInput = document.getElementById('destInput');
  const dateInput = document.getElementById('dateInput');
  const checkinInput = document.getElementById('checkinInput');
  const checkoutInput = document.getElementById('checkoutInput');
  const sortSelect = document.getElementById('sortSelect');
  const spotsCount = document.getElementById('spotsCount');
  const locationLabel = document.getElementById('locationLabel');
  const noResultsMessage = document.getElementById('noResultsMessage');
  const resetSearchBtn = document.getElementById('resetSearchBtn');
  const filterChips = document.querySelectorAll('.filter-chip');
  const mapContainer = document.getElementById('mapBox');

  // Read URL query params
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('location') && destInput) destInput.value = urlParams.get('location');
  if (urlParams.get('date') && dateInput) dateInput.value = urlParams.get('date');
  if (urlParams.get('checkin') && checkinInput) checkinInput.value = urlParams.get('checkin');
  if (urlParams.get('checkout') && checkoutInput) checkoutInput.value = urlParams.get('checkout');

  let activeFilter = 'all';
  let activeSort = 'recommended';

  // Render Spots into DOM dynamically
  function renderSpots(spots) {
    // Preserve the no-results container
    listingsContainer.innerHTML = '';
    if (noResultsMessage) listingsContainer.appendChild(noResultsMessage);

    if (spots.length === 0) {
      if (noResultsMessage) noResultsMessage.style.display = 'block';
      if (spotsCount) spotsCount.textContent = '0';
      renderMapPins([]);
      return;
    }

    if (noResultsMessage) noResultsMessage.style.display = 'none';
    if (spotsCount) spotsCount.textContent = spots.length;

    spots.forEach(spot => {
      const card = document.createElement('div');
      card.className = 'parking-card';
      card.setAttribute('data-spot-id', spot.id);

      const badgesHtml = `
        ${spot.covered ? '<span class="badge badge-green">🏠 Covered</span>' : ''}
        ${spot.ev ? '<span class="badge badge-coral">⚡ EV Charging</span>' : ''}
        ${spot.cctv ? '<span class="badge badge-grey">🛡️ CCTV 24/7</span>' : ''}
        ${spot.security ? '<span class="badge badge-grey">👮 Guard</span>' : ''}
      `;

      card.innerHTML = `
        <div class="card-icon">${spot.icon || '🅿️'}</div>
        <div class="card-content">
          <div class="card-header-row">
            <h4>${spot.title}</h4>
            <span class="rating font-bold text-green">⭐ ${spot.rating} (${spot.reviewsCount || 100}+)</span>
          </div>
          <div class="text-muted" style="font-size: 0.88rem;">📍 ${spot.distance} km away · ${spot.location}</div>
          <div class="tags-row">${badgesHtml}</div>
          <div class="card-footer-row">
            <div class="price">₹${spot.price}<span>/hr</span></div>
            <a href="choose-slot.html?spot=${spot.slug || spot.id}&date=${dateInput?.value || ''}&checkin=${checkinInput?.value || ''}&checkout=${checkoutInput?.value || ''}" class="btn btn-primary btn-sm">Select Slot &rarr;</a>
          </div>
        </div>
      `;

      // Hover / Click to link with map pin
      card.addEventListener('mouseenter', () => highlightPin(spot.id));
      card.addEventListener('click', (e) => {
        if (!e.target.closest('a')) {
          highlightPin(spot.id);
        }
      });

      listingsContainer.appendChild(card);
    });

    renderMapPins(spots);
  }

  // Render Interactive Pins on Map
  function renderMapPins(spots) {
    if (!mapContainer) return;
    mapContainer.querySelectorAll('.map-price-pin').forEach(p => p.remove());

    spots.forEach((spot, index) => {
      const pin = document.createElement('div');
      pin.className = `map-price-pin ${index === 0 ? 'active' : ''}`;
      pin.setAttribute('data-pin-id', spot.id);
      pin.style.top = spot.mapCoordinates?.top || `${25 + (index * 15)}%`;
      pin.style.left = spot.mapCoordinates?.left || `${30 + (index * 12)}%`;
      pin.innerHTML = `<span>${spot.icon || '🅿️'}</span> <strong>₹${spot.price}</strong>`;

      pin.addEventListener('click', () => {
        mapContainer.querySelectorAll('.map-price-pin').forEach(p => p.classList.remove('active'));
        pin.classList.add('active');

        // Scroll to card and highlight
        const targetCard = listingsContainer.querySelector(`[data-spot-id="${spot.id}"]`);
        if (targetCard) {
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          targetCard.classList.add('highlighted');
          setTimeout(() => targetCard.classList.remove('highlighted'), 2000);
        }
      });

      mapContainer.appendChild(pin);
    });
  }

  function highlightPin(spotId) {
    if (!mapContainer) return;
    mapContainer.querySelectorAll('.map-price-pin').forEach(pin => {
      if (pin.getAttribute('data-pin-id') === String(spotId)) {
        pin.classList.add('active');
      } else {
        pin.classList.remove('active');
      }
    });
  }

  // Filter & Sorting Logic
  function executeSearchAndFilter() {
    const allSpots = StorageManager.getAllSpots();
    const query = destInput ? destInput.value.trim().toLowerCase() : '';

    if (locationLabel) {
      locationLabel.textContent = query ? destInput.value.trim() : 'All Locations';
    }

    let filtered = allSpots.filter(spot => {
      // 1. Keyword search match
      if (query) {
        const searchable = `${spot.title} ${spot.location} ${spot.city}`.toLowerCase();
        const matchesQuery = searchable.includes(query) ||
          query.split(',').some(q => searchable.includes(q.trim())) ||
          query.split(' ').some(word => word.length >= 3 && searchable.includes(word));
        if (!matchesQuery) return false;
      }

      // 2. Filter chip condition
      if (activeFilter === 'distance' && spot.distance >= 0.5) return false;
      if (activeFilter === 'covered' && !spot.covered) return false;
      if (activeFilter === 'ev' && !spot.ev) return false;
      if (activeFilter === 'rating' && spot.rating < 4.8) return false;

      return true;
    });

    // 3. Sorting
    if (activeSort === 'price-low' || activeFilter === 'price') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (activeSort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (activeSort === 'distance') {
      filtered.sort((a, b) => a.distance - b.distance);
    }

    renderSpots(filtered);
  }

  // Event Listeners
  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      executeSearchAndFilter();
      showToast('Search results updated.', 'info');
    });
  }

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeFilter = chip.getAttribute('data-filter') || 'all';
      executeSearchAndFilter();
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      activeSort = sortSelect.value;
      executeSearchAndFilter();
    });
  }

  if (resetSearchBtn) {
    resetSearchBtn.addEventListener('click', () => {
      if (destInput) destInput.value = '';
      activeFilter = 'all';
      filterChips.forEach(c => c.classList.remove('active'));
      const allChip = document.querySelector('.filter-chip[data-filter="all"]');
      if (allChip) allChip.classList.add('active');
      executeSearchAndFilter();
    });
  }

  // Initial Execution
  executeSearchAndFilter();
}

/* ==========================================================================
   5. YASHIKA'S AUTHENTICATION MODULE (auth.html)
   ========================================================================== */
function setupAuthPage() {
  const authForm = document.getElementById('authForm');
  if (!authForm) return;

  let currentRole = 'parker';
  let currentMode = 'register'; // 'register' or 'login'

  const roleParker = document.getElementById('roleParker');
  const roleHost = document.getElementById('roleHost');
  const tabRegister = document.getElementById('tabRegister');
  const tabLogin = document.getElementById('tabLogin');
  const groupName = document.getElementById('groupName');
  const groupPhone = document.getElementById('groupPhone');
  const groupConfirmPass = document.getElementById('groupConfirmPass');
  const groupTerms = document.getElementById('groupTerms');
  const forgotPassLink = document.getElementById('forgotPassLink');
  const authSubmitBtn = document.getElementById('authSubmitBtn');
  const authTitle = document.getElementById('authTitle');
  const authSubtitle = document.getElementById('authSubtitle');

  const nameInput = document.getElementById('authName');
  const emailInput = document.getElementById('authEmail');
  const phoneInput = document.getElementById('authPhone');
  const passInput = document.getElementById('authPassword');
  const confirmPassInput = document.getElementById('authConfirmPassword');
  const strengthFill = document.getElementById('strengthFill');
  const strengthText = document.getElementById('strengthText');

  // Role Toggle
  window.setRole = function(role) {
    currentRole = role;
    if (role === 'parker') {
      roleParker?.classList.add('selected');
      roleHost?.classList.remove('selected');
    } else {
      roleHost?.classList.add('selected');
      roleParker?.classList.remove('selected');
    }
    updateSubmitButtonText();
  };

  // Auth Mode Toggle
  window.setAuthTab = function(mode) {
    currentMode = mode;
    if (mode === 'login') {
      tabLogin?.classList.add('active');
      tabRegister?.classList.remove('active');
      if (groupName) groupName.style.display = 'none';
      if (groupPhone) groupPhone.style.display = 'none';
      if (groupConfirmPass) groupConfirmPass.style.display = 'none';
      if (groupTerms) groupTerms.style.display = 'none';
      if (forgotPassLink) forgotPassLink.style.display = 'inline';
      if (strengthFill) strengthFill.parentElement.parentElement.style.display = 'none';

      if (authTitle) authTitle.textContent = 'Welcome Back';
      if (authSubtitle) authSubtitle.textContent = 'Enter your credentials to access your account';
    } else {
      tabRegister?.classList.add('active');
      tabLogin?.classList.remove('active');
      if (groupName) groupName.style.display = 'flex';
      if (groupPhone) groupPhone.style.display = 'flex';
      if (groupConfirmPass) groupConfirmPass.style.display = 'flex';
      if (groupTerms) groupTerms.style.display = 'block';
      if (forgotPassLink) forgotPassLink.style.display = 'none';
      if (strengthFill) strengthFill.parentElement.parentElement.style.display = 'block';

      if (authTitle) authTitle.textContent = 'Join PARK-O-BUDDY';
      if (authSubtitle) authSubtitle.textContent = 'Create an account to book spots or earn as a host';
    }
    updateSubmitButtonText();
  };

  function updateSubmitButtonText() {
    if (!authSubmitBtn) return;
    if (currentMode === 'login') {
      authSubmitBtn.textContent = 'Log In &rarr;';
    } else {
      authSubmitBtn.textContent = currentRole === 'host' ? 'Create Host Account &rarr;' : 'Create Parker Account &rarr;';
    }
  }

  // Live Password Strength Indicator (Yashika Validation requirement)
  if (passInput && strengthFill && strengthText) {
    passInput.addEventListener('input', () => {
      const val = passInput.value;
      let score = 0;
      if (val.length >= 6) score++;
      if (val.length >= 10) score++;
      if (/[A-Z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;

      if (val.length === 0) {
        strengthFill.style.width = '0%';
        strengthText.textContent = '';
      } else if (score <= 2) {
        strengthFill.style.width = '33%';
        strengthFill.style.backgroundColor = '#EF4444';
        strengthText.textContent = 'Weak password';
        strengthText.style.color = '#EF4444';
      } else if (score <= 4) {
        strengthFill.style.width = '66%';
        strengthFill.style.backgroundColor = '#F59E0B';
        strengthText.textContent = 'Moderate password';
        strengthText.style.color = '#F59E0B';
      } else {
        strengthFill.style.width = '100%';
        strengthFill.style.backgroundColor = '#16A36A';
        strengthText.textContent = 'Strong password';
        strengthText.style.color = '#16A36A';
      }
    });
  }

  // Form Submit with Comprehensive Validation
  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, 'Please enter a valid email address');
      isValid = false;
    } else {
      clearError(emailInput);
    }

    // Password validation
    if (passInput.value.length < 6) {
      showError(passInput, 'Password must be at least 6 characters long');
      isValid = false;
    } else {
      clearError(passInput);
    }

    // Sign Up Specific validations
    if (currentMode === 'register') {
      if (nameInput.value.trim().length < 3) {
        showError(nameInput, 'Full name must be at least 3 characters');
        isValid = false;
      } else {
        clearError(nameInput);
      }

      const phoneClean = phoneInput.value.replace(/[^0-9]/g, '');
      if (phoneClean.length < 10) {
        showError(phoneInput, 'Enter a valid 10-digit mobile number');
        isValid = false;
      } else {
        clearError(phoneInput);
      }

      if (confirmPassInput && confirmPassInput.value !== passInput.value) {
        showError(confirmPassInput, 'Passwords do not match');
        isValid = false;
      } else if (confirmPassInput) {
        clearError(confirmPassInput);
      }
    }

    if (!isValid) {
      showToast('Please fix the errors in the form.', 'error');
      return;
    }

    // Successful Auth Simulation
    const user = {
      name: currentMode === 'register' ? nameInput.value.trim() : (nameInput?.value.trim() || 'Rahul Sharma'),
      email: emailInput.value.trim(),
      phone: phoneInput?.value.trim() || '+91 98765 43210',
      role: currentRole,
      walletBalance: 450,
      isLoggedIn: true
    };
    StorageManager.setUser(user);

    showToast(currentMode === 'login' ? 'Welcome back! Redirecting...' : 'Account created successfully!', 'success');
    setTimeout(() => {
      window.location.href = currentRole === 'host' ? 'host.html' : 'dashboard.html';
    }, 1000);
  });

  function showError(input, msg) {
    input.classList.add('is-invalid');
    let err = input.parentElement.querySelector('.form-error');
    if (!err) {
      err = document.createElement('div');
      err.className = 'form-error';
      input.parentElement.appendChild(err);
    }
    err.textContent = msg;
    err.classList.add('visible');
  }

  function clearError(input) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    const err = input.parentElement.querySelector('.form-error');
    if (err) err.classList.remove('visible');
  }
}

/* ==========================================================================
   6. YASHIKA'S DASHBOARD MODULE (dashboard.html)
   ========================================================================== */
function setupDashboardPage() {
  const dashContainer = document.querySelector('.dashboard-layout');
  if (!dashContainer) return;

  const user = StorageManager.getUser();
  const activeBooking = StorageManager.getActiveBooking();
  const bookingHistory = StorageManager.getBookingHistory();

  // Populate User Info
  const userNameElements = document.querySelectorAll('.dash-user-name');
  userNameElements.forEach(el => el.textContent = user.name || 'Rahul Sharma');
  const userEmailElements = document.querySelectorAll('.dash-user-email');
  userEmailElements.forEach(el => el.textContent = user.email || 'rahul@example.com');
  const walletBalanceElements = document.querySelectorAll('.dash-wallet-bal');
  walletBalanceElements.forEach(el => el.textContent = `₹${user.walletBalance || 450}`);

  // Tab Switching Logic (All 5 interactive dashboard tabs)
  window.switchDashTab = function(btnElement, tabId) {
    document.querySelectorAll('.sidebar-menu button').forEach(b => b.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');

    document.querySelectorAll('.dashboard-tab-panel').forEach(panel => panel.classList.remove('active'));
    const targetPanel = document.getElementById(tabId);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }
  };

  // Render Active Booking Card
  const activeBookingContainer = document.getElementById('activeBookingContainer');
  if (activeBookingContainer && activeBooking) {
    activeBookingContainer.innerHTML = `
      <div class="card" style="border-left: 5px solid var(--primary-green); margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 14px;">
          <div>
            <span class="badge badge-green">● ACTIVE RESERVATION RIGHT NOW</span>
            <h3 style="margin-top: 6px; font-size: 1.3rem;">${activeBooking.spotTitle} — Slot <span class="text-coral">${activeBooking.slotNumber}</span></h3>
            <p class="text-muted" style="font-size: 0.92rem; margin-top: 4px;">📍 ${activeBooking.spotLocation} · Vehicle: <strong>${activeBooking.vehiclePlate}</strong></p>
            <div style="margin-top: 10px; font-size: 0.92rem;">
              Schedule: <strong>${activeBooking.date}, ${activeBooking.startTime} - ${activeBooking.endTime}</strong> 
              (Duration: <strong>${activeBooking.durationHours} hrs</strong> · Total Paid: <strong class="text-green">₹${activeBooking.totalAmount}</strong>)
            </div>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn btn-outline btn-sm" onclick="extendActiveBooking()">⏱️ Extend 1 hr (+₹40)</button>
            <a href="booking-confirmation.html" class="btn btn-primary btn-sm">📱 View QR Pass</a>
            <button class="btn btn-outline btn-sm text-danger" onclick="cancelActiveBooking()">Cancel</button>
          </div>
        </div>
      </div>
    `;
  }

  // Render Booking History Table
  const historyTbody = document.getElementById('historyTbody');
  if (historyTbody) {
    historyTbody.innerHTML = bookingHistory.map(b => `
      <tr>
        <td><strong>#${b.id}</strong></td>
        <td>${b.spotTitle}</td>
        <td><span class="badge badge-coral font-bold">${b.slotNumber}</span></td>
        <td>${b.date}</td>
        <td>₹${b.totalAmount}</td>
        <td><span class="badge ${b.status === 'Active' ? 'badge-green' : 'badge-grey'}">${b.status}</span></td>
        <td><button class="btn btn-outline btn-sm" onclick="downloadReceipt('${b.id}')">PDF</button></td>
      </tr>
    `).join('');
  }

  // Render Vehicles List
  renderVehiclesTab();

  // Add Vehicle Handler
  const addVehicleForm = document.getElementById('addVehicleForm');
  if (addVehicleForm) {
    addVehicleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = document.getElementById('vehicleTypeInput').value;
      const make = document.getElementById('vehicleMakeInput').value.trim();
      const plate = document.getElementById('vehiclePlateInput').value.trim().toUpperCase();

      if (!make || !plate) {
        showToast('Please fill out all vehicle fields.', 'error');
        return;
      }

      const list = StorageManager.getVehicles();
      list.push({ id: `v${Date.now()}`, type, make, plate, isDefault: false });
      StorageManager.saveVehicles(list);

      renderVehiclesTab();
      document.getElementById('addVehicleModal').style.display = 'none';
      addVehicleForm.reset();
      showToast(`Vehicle ${plate} added successfully!`, 'success');
    });
  }

  // Add Money to Wallet Handler
  const addMoneyForm = document.getElementById('addMoneyForm');
  if (addMoneyForm) {
    addMoneyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = parseInt(document.getElementById('walletAmountInput').value, 10);
      if (isNaN(amount) || amount <= 0) {
        showToast('Please enter a valid amount.', 'error');
        return;
      }

      user.walletBalance = (user.walletBalance || 0) + amount;
      StorageManager.setUser(user);
      walletBalanceElements.forEach(el => el.textContent = `₹${user.walletBalance}`);
      document.getElementById('addMoneyModal').style.display = 'none';
      showToast(`₹${amount} added to Park-o-Wallet!`, 'success');
    });
  }

  // Account Settings Form Handler
  const accountSettingsForm = document.getElementById('accountSettingsForm');
  if (accountSettingsForm) {
    accountSettingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      user.name = document.getElementById('settingsName').value.trim();
      user.email = document.getElementById('settingsEmail').value.trim();
      user.phone = document.getElementById('settingsPhone').value.trim();
      StorageManager.setUser(user);
      setupNavbar();
      showToast('Profile information updated successfully!', 'success');
    });
  }
}

function renderVehiclesTab() {
  const container = document.getElementById('vehiclesListContainer');
  if (!container) return;
  const vehicles = StorageManager.getVehicles();

  container.innerHTML = vehicles.map(v => `
    <div class="vehicle-card">
      <div class="vehicle-details">
        <div class="vehicle-icon">${v.type === 'Bike' ? '🏍️' : '🚗'}</div>
        <div>
          <h4 style="margin: 0; font-size: 1.05rem;">${v.make} ${v.isDefault ? '<span class="badge badge-green" style="font-size: 0.7rem;">Default</span>' : ''}</h4>
          <span class="text-muted" style="font-size: 0.88rem;">Plate: <strong>${v.plate}</strong> · Type: ${v.type}</span>
        </div>
      </div>
      <div>
        <button class="btn btn-outline btn-sm text-danger" onclick="deleteVehicle('${v.id}')">Remove</button>
      </div>
    </div>
  `).join('');
}

window.deleteVehicle = function(id) {
  let list = StorageManager.getVehicles();
  list = list.filter(v => v.id !== id);
  StorageManager.saveVehicles(list);
  renderVehiclesTab();
  showToast('Vehicle removed.', 'info');
};

window.extendActiveBooking = function() {
  const active = StorageManager.getActiveBooking();
  if (!active) return;
  active.durationHours += 1;
  active.totalAmount += 40;
  StorageManager.setActiveBooking(active);
  showToast('Active booking extended by 1 hour (+₹40).', 'success');
  setupDashboardPage();
};

window.cancelActiveBooking = function() {
  if (confirm('Are you sure you want to cancel this booking? A 100% refund will be credited to your wallet.')) {
    const user = StorageManager.getUser();
    const active = StorageManager.getActiveBooking();
    user.walletBalance = (user.walletBalance || 0) + (active?.totalAmount || 0);
    StorageManager.setUser(user);
    localStorage.removeItem('pob_active_booking');
    showToast('Booking cancelled. Amount refunded to wallet.', 'success');
    setTimeout(() => window.location.reload(), 1000);
  }
};

window.downloadReceipt = function(id) {
  showToast(`Generating receipt PDF for Pass #${id}...`, 'info');
  setTimeout(() => {
    window.print();
  }, 800);
};

/* ==========================================================================
   7. MEHAK'S HOST & ABOUT US MODULES (host.html & about.html)
   ========================================================================== */
function setupHostPage() {
  const hostForm = document.getElementById('hostForm');
  const hoursSlider = document.getElementById('hoursSlider');
  const rateSlider = document.getElementById('rateSlider');
  const hoursVal = document.getElementById('hoursVal');
  const rateVal = document.getElementById('rateVal');
  const projectedEarnings = document.getElementById('projectedEarnings');

  // Real-time Earnings Estimator Calculator (Mehak)
  function calculateEarnings() {
    if (!hoursSlider || !rateSlider) return;
    const hrs = parseInt(hoursSlider.value, 10);
    const rate = parseInt(rateSlider.value, 10);
    const occupancyDays = 26; // Avg monthly active days
    const total = hrs * rate * occupancyDays;

    if (hoursVal) hoursVal.textContent = `${hrs} hrs / day`;
    if (rateVal) rateVal.textContent = `₹${rate} / hr`;
    if (projectedEarnings) projectedEarnings.textContent = `₹${total.toLocaleString('en-IN')}`;
  }

  if (hoursSlider && rateSlider) {
    hoursSlider.addEventListener('input', calculateEarnings);
    rateSlider.addEventListener('input', calculateEarnings);
    calculateEarnings();
  }

  // Photo Input Handling
  const photoInput = document.getElementById('photoInput');
  const photoStatus = document.getElementById('photoStatus');
  if (photoInput && photoStatus) {
    photoInput.addEventListener('change', () => {
      if (photoInput.files.length > 0) {
        photoStatus.textContent = `✓ ${photoInput.files[0].name} uploaded`;
        photoStatus.style.display = 'block';
      }
    });
  }

  // Host Listing Form Submission & Validation
  if (hostForm) {
    hostForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.getElementById('hostTitle')?.value.trim();
      const address = document.getElementById('hostAddress')?.value.trim();
      const city = document.getElementById('hostCity')?.value.trim() || 'Gurugram';
      const rate = parseInt(document.getElementById('hostRate')?.value, 10) || 40;
      const type = document.getElementById('hostType')?.value || 'driveway';
      const covered = document.getElementById('amenityCovered')?.checked ?? true;
      const ev = document.getElementById('amenityEV')?.checked ?? false;
      const cctv = document.getElementById('amenityCCTV')?.checked ?? true;
      const security = document.getElementById('amenitySecurity')?.checked ?? true;

      if (!title || !address) {
        showToast('Please fill in both space title and address.', 'error');
        return;
      }

      // Create new parking spot object
      const newSpot = {
        id: `host-${Date.now()}`,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: title,
        location: address,
        city: city,
        price: rate,
        distance: 0.2,
        rating: 5.0,
        reviewsCount: 1,
        covered: covered,
        ev: ev,
        cctv: cctv,
        security: security,
        valet: false,
        vehicleTypes: ["car", "suv", "bike"],
        host: StorageManager.getUser().name || "New Host",
        icon: type === 'garage' ? '🏠' : (type === 'basement' ? '🏬' : '🅿️'),
        mapCoordinates: { top: "40%", left: "50%" }
      };

      StorageManager.addCustomSpot(newSpot);
      showToast(`Success! Your parking spot "${title}" is now published and live on search!`, 'success');

      setTimeout(() => {
        window.location.href = 'search.html';
      }, 1500);
    });
  }
}

function setupAboutPage() {
  // Interactive Accordion for FAQs (Mehak)
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.faq-item');
      const isOpen = parent.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('open'));
      if (!isOpen) parent.classList.add('open');
    });
  });

  // Contact / Feedback form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you! Your inquiry has been sent to our team.', 'success');
      contactForm.reset();
    });
  }
}

/* ==========================================================================
   8. NANDINI'S CHOOSE SLOT & BOOKING CONFIRMATION MODULES
   ========================================================================== */
function setupSlotPage() {
  const slotContainer = document.querySelector('.slot-layout');
  if (!slotContainer) return;

  const urlParams = new URLSearchParams(window.location.search);
  const spotParam = urlParams.get('spot') || 'green-view';
  const allSpots = StorageManager.getAllSpots();
  const spot = allSpots.find(s => s.slug === spotParam || s.id === spotParam) || allSpots[0];

  // Populate Spot Details Header
  const spotTitleEl = document.getElementById('spotTitle');
  const spotLocationEl = document.getElementById('spotLocation');
  const spotPriceHeaderEl = document.getElementById('spotPriceHeader');
  const summarySpotTitleEl = document.getElementById('summarySpotTitle');

  if (spotTitleEl) spotTitleEl.textContent = spot.title;
  if (spotLocationEl) spotLocationEl.textContent = `📍 ${spot.location} · Host: ${spot.host}`;
  if (spotPriceHeaderEl) spotPriceHeaderEl.textContent = `₹${spot.price}`;
  if (summarySpotTitleEl) summarySpotTitleEl.textContent = spot.title;

  // Floor Tabs
  const floorButtons = document.querySelectorAll('.floor-btn');
  floorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      floorButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showToast(`Switched to: ${btn.textContent}`, 'info');
    });
  });

  // Slot Selection & Calculation Engine
  let selectedSlot = 'A3';
  let vehicleType = 'car';
  let hours = 4;
  const baseHourlyRate = spot.price;
  const convenienceFee = 15;

  const slotButtons = document.querySelectorAll('.slot-btn:not(.occupied)');
  const summarySlotEl = document.getElementById('summarySlot');
  const slotIndicatorEl = document.getElementById('slotIndicator');
  const summaryBasePriceEl = document.getElementById('summaryBasePrice');
  const summaryTaxEl = document.getElementById('summaryTax');
  const summaryTotalEl = document.getElementById('summaryTotal');
  const btnConfirmPay = document.getElementById('btnConfirmPay');
  const vehicleTypeSelect = document.getElementById('slotVehicleType');
  const evAddonCheck = document.getElementById('addonEvCharging');
  const checkinInput = document.getElementById('slotCheckin');
  const checkoutInput = document.getElementById('slotCheckout');

  function calculatePrice() {
    let multiplier = 1.0;
    if (vehicleType === 'suv') multiplier = 1.25;
    if (vehicleType === 'bike') multiplier = 0.6;

    const rateAfterVehicle = Math.round(baseHourlyRate * multiplier);
    const subtotal = rateAfterVehicle * hours;
    const evAddon = (evAddonCheck && evAddonCheck.checked) ? 50 : 0;
    const taxableAmount = subtotal + evAddon + convenienceFee;
    const tax = Math.round(taxableAmount * 0.05); // 5% GST
    const total = taxableAmount + tax;

    if (summaryBasePriceEl) summaryBasePriceEl.textContent = `₹${subtotal} (₹${rateAfterVehicle} × ${hours}h)`;
    if (summaryTaxEl) summaryTaxEl.textContent = `₹${tax}`;
    if (summaryTotalEl) summaryTotalEl.textContent = `₹${total}`;
    if (btnConfirmPay) btnConfirmPay.textContent = `Confirm & Pay ₹${total}`;

    return { total, subtotal, tax, hours };
  }

  slotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      slotButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSlot = btn.getAttribute('data-slot');

      if (summarySlotEl) summarySlotEl.textContent = `Slot ${selectedSlot}`;
      if (slotIndicatorEl) slotIndicatorEl.textContent = selectedSlot;
      showToast(`Selected Slot ${selectedSlot}`, 'info');
    });
  });

  if (vehicleTypeSelect) {
    vehicleTypeSelect.addEventListener('change', () => {
      vehicleType = vehicleTypeSelect.value;
      calculatePrice();
    });
  }

  if (evAddonCheck) {
    evAddonCheck.addEventListener('change', calculatePrice);
  }

  function updateHoursFromInputs() {
    if (checkinInput && checkoutInput) {
      const [inH, inM] = checkinInput.value.split(':').map(Number);
      const [outH, outM] = checkoutInput.value.split(':').map(Number);
      const diff = (outH + outM / 60) - (inH + inM / 60);
      hours = diff > 0 ? Math.ceil(diff) : 4;
      calculatePrice();
    }
  }

  if (checkinInput) checkinInput.addEventListener('change', updateHoursFromInputs);
  if (checkoutInput) checkoutInput.addEventListener('change', updateHoursFromInputs);

  calculatePrice();

  // Booking Confirmation Trigger (Nandini)
  if (btnConfirmPay) {
    btnConfirmPay.addEventListener('click', () => {
      const plate = document.getElementById('vehiclePlate')?.value.trim().toUpperCase() || 'DL 03 CA 9081';
      const pricing = calculatePrice();
      const bookingId = `POB-${Math.floor(10000 + Math.random() * 90000)}`;

      const bookingData = {
        id: bookingId,
        spotTitle: spot.title,
        spotLocation: spot.location,
        slotNumber: selectedSlot,
        vehiclePlate: plate,
        vehicleType: vehicleType.toUpperCase(),
        date: "Today, 10 Sep 2026",
        startTime: checkinInput?.value || "09:00",
        endTime: checkoutInput?.value || "13:00",
        durationHours: hours,
        totalAmount: pricing.total,
        status: "Active",
        createdAt: new Date().toISOString()
      };

      StorageManager.setActiveBooking(bookingData);
      showToast('Payment Authorized! Generating Entry QR Pass...', 'success');

      setTimeout(() => {
        window.location.href = 'booking-confirmation.html';
      }, 1000);
    });
  }
}

function setupConfirmationPage() {
  const container = document.querySelector('.confirmation-container');
  if (!container) return;

  const booking = StorageManager.getActiveBooking();
  if (!booking) return;

  const passIdEl = document.getElementById('passId');
  const passSlotEl = document.getElementById('passSlot');
  const passLocationEl = document.getElementById('passLocation');
  const passPlateEl = document.getElementById('passPlate');
  const passTimeEl = document.getElementById('passTime');
  const passAmountEl = document.getElementById('passAmount');

  if (passIdEl) passIdEl.textContent = `#${booking.id}`;
  if (passSlotEl) passSlotEl.textContent = booking.slotNumber;
  if (passLocationEl) passLocationEl.textContent = booking.spotTitle;
  if (passPlateEl) passPlateEl.textContent = booking.vehiclePlate;
  if (passTimeEl) passTimeEl.textContent = `${booking.date} (${booking.startTime} - ${booking.endTime})`;
  if (passAmountEl) passAmountEl.textContent = `₹${booking.totalAmount}`;
}

/* ==========================================================================
   9. INITIALIZATION ROUTER
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  setupHomePage();
  setupSearchPage();
  setupAuthPage();
  setupDashboardPage();
  setupHostPage();
  setupAboutPage();
  setupSlotPage();
  setupConfirmationPage();
});
