async function loadCars() {
  try {
    cars = await apiFetch("/cars");
    favorites = cars.filter(c => c.isFavorite).map(c => c.id);
    displayCars();
    updateFavBadge();
  } catch (e) {
    showToast("❌ Failed to load cars", true);
  }
}

async function createCar() {
  const make  = document.getElementById("make").value.trim();
  const model = document.getElementById("model").value.trim();
  const year  = parseInt(document.getElementById("year").value.trim());
  const price = parseFloat(document.getElementById("price").value.trim());
  const image = document.getElementById("image").value.trim();

  if (!make || !model || !year || !price) {
    showToast("⚠ Please fill all required fields", true);
    return;
  }

  try {
    const car = await apiFetch("/cars", {
      method: "POST",
      body: JSON.stringify({ make, model, year, price, image: image || null })
    });
    cars.push(car);
    clearForm();
    displayCars();
    showToast(`✅ ${make} ${model} added!`);
  } catch (e) {
    showToast(`❌ ${e.message}`, true);
  }
}

function editCar(id) {
  const car = cars.find(c => c.id === id);
  if (!car) return;

  editId = id;
  document.getElementById("edit-make").value  = car.make;
  document.getElementById("edit-model").value = car.model;
  document.getElementById("edit-year").value  = car.year;
  document.getElementById("edit-price").value = car.price;
  document.getElementById("edit-image").value = car.image;

  openModal("editModal");
}

async function saveEdit() {
  if (editId === null) return;

  const make  = document.getElementById("edit-make").value.trim();
  const model = document.getElementById("edit-model").value.trim();
  const year  = parseInt(document.getElementById("edit-year").value.trim());
  const price = parseFloat(document.getElementById("edit-price").value.trim());
  const image = document.getElementById("edit-image").value.trim();

  if (!make || !model || !year || !price) {
    showToast("⚠ Please fill all fields", true);
    return;
  }

  try {
    await apiFetch(`/cars/${editId}`, {
      method: "PUT",
      body: JSON.stringify({ make, model, year, price, image: image || null })
    });
    cars = cars.map(c => c.id === editId ? { ...c, make, model, year, price, image: image || c.image } : c);
    closeModal("editModal");
    editId = null;
    displayCars();
    showToast(`✏️ ${make} ${model} updated`);
  } catch (e) {
    showToast(`❌ ${e.message}`, true);
  }
}

async function deleteCar(id) {
  const car = cars.find(c => c.id === id);
  try {
    await apiFetch(`/cars/${id}`, { method: "DELETE" });
    cars      = cars.filter(c => c.id !== id);
    favorites = favorites.filter(f => f !== id);
    bookings  = bookings.filter(b => b.carId !== id);
    displayCars();
    updateFavBadge();
    showToast(`🗑 ${car ? car.make + " " + car.model : "Car"} removed`);
  } catch (e) {
    showToast(`❌ ${e.message}`, true);
  }
}

async function toggleFavorite(id) {
  if (!currentUser) {
    showToast("⚠ Please login to add favorites", true);
    openModal("loginModal");
    return;
  }

  const wasFav = favorites.includes(id);
  try {
    if (wasFav) {
      await apiFetch(`/favorites/${id}`, { method: "DELETE" });
      favorites = favorites.filter(f => f !== id);
    } else {
      await apiFetch(`/favorites/${id}`, { method: "POST" });
      favorites = [...favorites, id];
    }
    cars = cars.map(c => c.id === id ? { ...c, isFavorite: !wasFav } : c);
    displayCars();
    updateFavBadge();
    showToast(wasFav ? "💔 Removed from favorites" : "⭐ Added to favorites");
  } catch (e) {
    showToast(`❌ ${e.message}`, true);
  }
}

// ─── FAVORITES MODAL ─────────────────────────────────────────────────────────
function openFavoritesModal() {
  const favCars = cars.filter(c => favorites.includes(c.id));

  if (favCars.length === 0) {
    document.getElementById("favoritesContent").innerHTML = `
      <div class="empty-state" style="padding:40px 0">
        <div class="empty-icon">⭐</div>
        <h3>No Favorites Yet</h3>
        <p>Star a car to see it here.</p>
      </div>`;
  } else {
    document.getElementById("favoritesContent").innerHTML = `
      <div class="fav-modal-grid">
        ${favCars.map(car => `
          <div class="fav-modal-card">
            <img src="${car.image}"
              onerror="this.src='https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80'"
              alt="${car.make} ${car.model}">
            <div class="fav-modal-info">
              <div class="fav-modal-name">${car.make} ${car.model}</div>
              <div class="fav-modal-price">€${Number(car.price).toLocaleString()}</div>
              <div class="fav-modal-year">📅 ${car.year}</div>
              <button class="fav-remove-btn" onclick="removeFavFromModal(${car.id})">
                💔 Remove
              </button>
            </div>
          </div>
        `).join("")}
      </div>`;
  }

  openModal("favoritesModal");
}

async function removeFavFromModal(id) {
  try {
    await apiFetch(`/favorites/${id}`, { method: "DELETE" });
    favorites = favorites.filter(f => f !== id);
    cars = cars.map(c => c.id === id ? { ...c, isFavorite: false } : c);
    displayCars();
    updateFavBadge();
    openFavoritesModal();
    showToast("💔 Removed from favorites");
  } catch (e) {
    showToast(`❌ ${e.message}`, true);
  }
}
