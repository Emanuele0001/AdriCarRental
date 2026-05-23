function updateFavBadge() {
  document.getElementById("headerFavCount").textContent = favorites.length;
}

function displayCars() {
  const list = document.getElementById("carList");
  const search = document.getElementById("search").value.toLowerCase();
  const min = Number(document.getElementById("minPrice").value);
  const max = Number(document.getElementById("maxPrice").value);
  const sort = document.getElementById("sort").value;

  document.getElementById("minVal").textContent = `€${min.toLocaleString()}`;
  document.getElementById("maxVal").textContent = `€${max.toLocaleString()}`;

  let filtered = cars.filter((c) => {
    const matchSearch =
      c.make.toLowerCase().includes(search) ||
      c.model.toLowerCase().includes(search);
    const p = Number(c.price);
    const matchPrice = p >= min && p <= max;
    const matchTab = activeTab === "all" || c.isFavorite;
    return matchSearch && matchPrice && matchTab;
  });

  if (sort === "high")
    filtered.sort((a, b) => Number(b.price) - Number(a.price));
  if (sort === "low")
    filtered.sort((a, b) => Number(a.price) - Number(b.price));
  if (sort === "newest")
    filtered.sort((a, b) => Number(b.year) - Number(a.year));

  // Stats
  document.getElementById("statTotal").textContent = cars.length;
  document.getElementById("statFavs").textContent = favorites.length;
  updateFavBadge();

  const avg = cars.length
    ? Math.round(cars.reduce((s, c) => s + Number(c.price), 0) / cars.length)
    : 0;
  document.getElementById("statAvg").textContent = cars.length
    ? `€${avg.toLocaleString()}`
    : "—";

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🚗</div>
        <h3>${activeTab === "fav" ? "No Favorites Yet" : "No Cars Found"}</h3>
        <p>${activeTab === "fav" ? "Star a car to add it here." : "Add your first car using the form."}</p>
      </div>`;
    return;
  }

  const isAdmin = currentUser && currentUser.role === "ROLE_ADMIN";
  const isUser = currentUser && currentUser.role === "ROLE_USER";

  list.innerHTML = filtered
    .map((car) => {
      const isFav = car.isFavorite;
      const isBooked = car.isBooked;
      return `
      <div class="car-card ${isFav ? "is-favorite" : ""} ${isBooked ? "is-booked" : ""}">
        <div class="card-img-wrap">
          <img src="${car.image}"
            onerror="this.src='https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80'"
            alt="${car.make} ${car.model}">
          <button class="fav-badge ${isFav ? "active" : ""}"
            onclick="toggleFavorite(${car.id})"
            title="${isFav ? "Remove favorite" : "Add to favorites"}">
            ${isFav ? "⭐" : "☆"}
          </button>
          ${isBooked ? '<span class="booked-ribbon">BOOKED</span>' : ""}
        </div>
        <div class="card-body">
          <div class="card-header-row">
            <span class="card-make">${car.make}</span>
            <span class="card-year">📅 ${car.year}</span>
          </div>
          <div class="card-model">${car.model}</div>
          <div class="card-price">€${Number(car.price).toLocaleString()}</div>
          <div class="card-tags">
            ${isBooked
              ? '<span class="tag tag-booked">🔒 Booked</span>'
              : '<span class="tag tag-available">✓ Available</span>'}
            ${isFav ? '<span class="tag tag-fav">⭐ Favorite</span>' : ""}
          </div>
          <div class="card-actions">
            ${isAdmin ? `<button class="btn-sm btn-edit" onclick="editCar(${car.id})">✏ Edit</button>` : ""}
            ${isAdmin ? `<button class="btn-sm btn-delete" onclick="deleteCar(${car.id})">🗑</button>` : ""}
            ${isUser ? (isBooked
              ? `<button class="btn-sm btn-booked" disabled>🔒 Booked</button>`
              : `<button class="btn-sm btn-book" onclick="openBookingModal(${car.id})">📅 Book</button>`
            ) : ""}
          </div>
        </div>
      </div>`;
    })
    .join("");
}

function switchTab(tab, btn) {
  activeTab = tab;
  document
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  displayCars();
}

function openModal(id) {
  document.getElementById(id).classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal(id) {
  document.getElementById(id).classList.remove("open");
  document.body.style.overflow = "";
}

document.querySelectorAll(".modal-overlay").forEach((overlay) => {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document
      .querySelectorAll(".modal-overlay.open")
      .forEach((m) => closeModal(m.id));
  }
});

function clearForm() {
  ["make", "model", "year", "price", "image"].forEach((id) => {
    document.getElementById(id).value = "";
  });
}

function showToast(msg, isError = false) {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast${isError ? " error" : ""}`;
  toast.textContent = msg;
  container.appendChild(toast);
  requestAnimationFrame(() =>
    requestAnimationFrame(() => toast.classList.add("show")),
  );
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}
