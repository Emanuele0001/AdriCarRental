let cars      = JSON.parse(localStorage.getItem("cars"))      || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let users     = JSON.parse(localStorage.getItem("users"))     || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

let editId    = null;
let activeTab = 'all';
