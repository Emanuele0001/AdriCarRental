// crud-et
function createCar()
 {
  const make  = document.getElementById("make").value.trim();
  const model = document.getElementById("model").value.trim();
  const year  = document.getElementById("year").value.trim();
  const price = document.getElementById("price").value.trim();
  const image = document.getElementById("image").value.trim();

  if (!make || !model || !year || !price) 
  {
    showToast("⚠ Please fill all required fields", true);
    return;
  }

  cars.push({
    id: Date.now(),
    make, model, year, price,
    image: image || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80"
  });


  localStorage.setItem("cars", JSON.stringify(cars));
  clearForm();
  displayCars();
  showToast(`✅ ${make} ${model} added!`);
}

function editCar(id)
 {
  const car = cars.find(c => c.id === id);
  if (!car) return;

  editId = id;
  document.getElementById('edit-make').value  = car.make;
  document.getElementById('edit-model').value = car.model;
  document.getElementById('edit-year').value  = car.year;
  document.getElementById('edit-price').value = car.price;
  document.getElementById('edit-image').value = car.image;

  openModal('editModal');
}

function saveEdit() 
{
  if (editId === null) return;

  const make  = document.getElementById('edit-make').value.trim();
  const model = document.getElementById('edit-model').value.trim();
  const year  = document.getElementById('edit-year').value.trim();
  const price = document.getElementById('edit-price').value.trim();
  const image = document.getElementById('edit-image').value.trim();

  if (!make || !model || !year || !price)
     {
    showToast("⚠ Please fill all fields", true);
    return;
  }

  cars = cars.map(c => c.id === editId ? { ...c, make, model, year, price, image: image || c.image } : c
  );

  localStorage.setItem("cars", JSON.stringify(cars));
  closeModal('editModal');
  editId = null;
  displayCars();
  showToast(`✏️ ${make} ${model} updated`);
}

function deleteCar(id) 
{
  
  const car = cars.find(c => c.id === id);
  cars      = cars.filter(c => c.id !== id);
  favorites = favorites.filter(f => f !== id);
  localStorage.setItem("cars",      JSON.stringify(cars));
  localStorage.setItem("favorites", JSON.stringify(favorites));
  displayCars();
  showToast(`🗑 ${car ? car.make + ' ' + car.model : 'Car'} removed`);
}

function toggleFavorite(id)
 {
  const wasFav = favorites.includes(id);
  favorites = wasFav ? favorites.filter(f => f !== id) : [...favorites, id];
  localStorage.setItem("favorites", JSON.stringify(favorites));
  displayCars();
  updateFavBadge();
  showToast(wasFav ? '💔 Removed from favorites' : '⭐ Added to favorites');
}

function showDetails(id) 
{
  const car = cars.find(c => c.id === id);
  if (!car) return;

  document.getElementById('detailsContent').innerHTML = `
    <img class="details-img" src="${car.image}"
      onerror="this.src='https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80'">
    <div class="detail-row"><span class="dk">Make</span><span class="dv">${car.make}</span></div>
    <div class="detail-row"><span class="dk">Model</span><span class="dv">${car.model}</span></div>
    <div class="detail-row"><span class="dk">Year</span><span class="dv">${car.year}</span></div>
    <div class="detail-row"><span class="dk">Price</span>
      <span class="dv detail-price">€${Number(car.price).toLocaleString()}</span></div>
    <div class="detail-row"><span class="dk">Status</span>
      <span class="dv">${favorites.includes(car.id) ? '⭐ Favorite' : 'Not favorited'}</span></div>
  `;

  document.getElementById('detailsTitle').innerHTML = `${car.make} <em>${car.model}</em>`;
  openModal('detailsModal');
}

// ─── FAVORITES MODAL ────────────────────────────────────────────────────
function openFavoritesModal()
 {
  const favCars = cars.filter(c => favorites.includes(c.id));

  if (favCars.length === 0) 
    {
    document.getElementById('favoritesContent').innerHTML = `
      <div class="empty-state" style="padding:40px 0">
        <div class="empty-icon">⭐</div>
        <h3>No Favorites Yet</h3>
        <p>Star a car to see it here.</p>
      </div>`;
  } 

  else 
    {
    document.getElementById('favoritesContent').innerHTML = `
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
        `).join('')}
      </div>`;
  }

  openModal('favoritesModal');
}

function removeFavFromModal(id) 
{
  favorites = favorites.filter(f => f !== id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  displayCars();
  updateFavBadge();
  openFavoritesModal(); // re-render modal
  showToast('💔 Removed from favorites');
}
