//kjo a per nje future auth..  po su desh e lejme heqim  por pash qe gr. e tjera e kishin ber
function doLogin() {
  const email = document.getElementById("login-email").value.trim();
  const pass = document.getElementById("login-pass").value.trim();

  if (!email || !pass) {
    showToast("⚠ Fill in email and password", true);
    return;
  }

  const user = users.find((u) => u.email === email && u.password === pass);
  if (!user) {
    showToast("❌ invalid email or password", true);
    return;
  }

  currentUser = {
    name: user.name,
    email: user.email,
    role: user.role || "ROLE_USER",
  };
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  closeModal("loginModal");
  updateLoginBtn();
  showToast(`👋 Welcome back!, ${user.name}!`);
}

function doRegister() {
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const pass = document.getElementById("reg-pass").value.trim();

  if (!name || !email || !pass) {
    showToast("⚠ Fill all fields", true);
    return;
  }
  if (users.find((u) => u.email === email)) {
    showToast("⚠ Email already registered", true);
    return;
  }

  users.push({ name, email, password: pass, role: "ROLE_USER" });
  localStorage.setItem("users", JSON.stringify(users));

  currentUser = { name, email, role: "ROLE_USER" };
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  closeModal("loginModal");
  updateLoginBtn();
  showToast(`🎉 Account created! Welcome, ${name}!`);
}

function doLogout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  updateLoginBtn();
  showToast("👋 Logged out");
}

function updateLoginBtn() {
  const btn = document.querySelector(".btn-login");

  // Toggle Admin Panel Visibility
  const isAdmin = currentUser && currentUser.role === "ROLE_ADMIN";
  const addPanel = document.getElementById("addVehiclePanel");
  if (addPanel) {
    addPanel.style.display = isAdmin ? "block" : "none";
  }

  // Re-render cars to hide/show edit/delete buttons based on the user
  if (typeof displayCars === "function") {
    displayCars();
  }

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
