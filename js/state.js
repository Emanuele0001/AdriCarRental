let cars = JSON.parse(localStorage.getItem("cars")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];
let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

// Seed default admin user
if (!users.find((u) => u.email === "admin@admin.com")) {
  users.push({
    name: "Admin",
    email: "admin@admin.com",
    password: "admin",
    role: "ROLE_ADMIN",
  });
  localStorage.setItem("users", JSON.stringify(users));
}

let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

let editId = null;
let activeTab = "all";
