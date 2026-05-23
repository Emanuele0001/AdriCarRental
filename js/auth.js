async function doLogin() {
  const email = document.getElementById("login-email").value.trim();
  const pass = document.getElementById("login-pass").value.trim();

  if (!email || !pass) { showToast("⚠ Fill in email and password", true); return; }

  try {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password: pass })
    });
    _setSession(data);
    closeModal("loginModal");
    updateLoginBtn();
    showToast(`👋 Welcome back!, ${data.name}!`);
    await loadCars();
  } catch (e) {
    showToast(`❌ ${e.message}`, true);
  }
}

async function doRegister() {
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const pass = document.getElementById("reg-pass").value.trim();

  if (!name || !email || !pass) { showToast("⚠ Fill all fields", true); return; }

  try {
    const data = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password: pass })
    });
    _setSession(data);
    closeModal("loginModal");
    updateLoginBtn();
    showToast(`🎉 Account created! Welcome, ${name}!`);
    await loadCars();
  } catch (e) {
    showToast(`❌ ${e.message}`, true);
  }
}

function doLogout() {
  currentUser = null;
  token = null;
  localStorage.removeItem("currentUser");
  localStorage.removeItem("token");
  favorites = [];
  bookings = [];
  updateLoginBtn();
  displayCars();
  showToast("👋 Logged out");
}

function _setSession(data) {
  token = data.token;
  currentUser = { name: data.name, email: data.email, role: data.role };
  localStorage.setItem("token", token);
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
}

function updateLoginBtn() {
  const btn = document.querySelector(".btn-login");

  const isAdmin = currentUser && currentUser.role === "ROLE_ADMIN";
  const addPanel = document.getElementById("addVehiclePanel");
  if (addPanel) addPanel.style.display = isAdmin ? "block" : "none";

  const bookingsBtn = document.getElementById("btn-all-bookings");
  if (bookingsBtn) bookingsBtn.style.display = isAdmin ? "inline-flex" : "none";

  if (typeof displayCars === "function") displayCars();

  if (currentUser) {
    btn.innerHTML = `
      <div class="user-avatar">${currentUser.name.charAt(0).toUpperCase()}</div>
      <span>${currentUser.name}</span>
    `;
    btn.classList.add("logged-in");
    btn.onclick = doLogout;
  } else {
    btn.innerHTML = `👤 <span data-i18n="login">Login</span>`;
    btn.classList.remove("logged-in");
    btn.onclick = () => openModal("loginModal");
  }
}

function showRegister() {
  document.getElementById("loginView").style.display = "none";
  document.getElementById("registerView").style.display = "block";
  return false;
}

function showLogin() {
  document.getElementById("registerView").style.display = "none";
  document.getElementById("loginView").style.display = "block";
  return false;
}
