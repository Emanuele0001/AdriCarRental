/*et cars = JSON.parse(localStorage.getItem("cars")) || [];
let editId = null;
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function saveCar() {
  const make = document.getElementById("make").value.trim();
  const model = document.getElementById("model").value.trim();
  const year = document.getElementById("year").value.trim();
  const price = document.getElementById("price").value.trim();
  const image = document.getElementById("image").value.trim();

  if (!make || !model || !year || !price) {
    alert("Please fill all fields");
    return;
  }

  if (editId !== null) 
    {
    cars = cars.map(c =>
      c.id === editId
        ? { ...c, make, model, year, price, image: image || c.image }
        : c
    );
    editId = null;
  } 
  else 
    {
    cars.push({
      id: Date.now(),
      make,
      model,
      year,
      price,
      image: image || "https://via.placeholder.com/300"
    });
  }

  localStorage.setItem("cars", JSON.stringify(cars));
  clearForm();
  displayCars();
}

function editCar(id) {
  const car = cars.find(c => c.id === id);
  if (!car) return;

  document.getElementById("make").value = car.make;
  document.getElementById("model").value = car.model;
  document.getElementById("year").value = car.year;
  document.getElementById("price").value = car.price;
  document.getElementById("image").value = car.image;

  editId = id;
}

function deleteCar(id) {
  cars = cars.filter(c => c.id !== id);
  localStorage.setItem("cars", JSON.stringify(cars));
  displayCars();
}

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(f => f !== id);
  } else {
    favorites.push(id);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  displayCars();
}

function showDetails(id) {
  const car = cars.find(c => c.id === id);

  document.getElementById("modalContent").innerHTML = `
    <img src="${car.image}" onerror="this.src='https://via.placeholder.com/300'">
    <h4>${car.make} ${car.model}</h4>
    <p><b>Year:</b> ${car.year}</p>
    <p><b>Price:</b> €${car.price}</p>
  `;

  new bootstrap.Modal(document.getElementById("detailsModal")).show();
}

function displayCars() {
  const list = document.getElementById("carList");
  const search = document.getElementById("search").value.toLowerCase();

  const min = Number(document.getElementById("minPrice").value);
  const max = Number(document.getElementById("maxPrice").value);

  document.getElementById("minVal").innerText = min;
  document.getElementById("maxVal").innerText = max;

  let filtered = cars.filter(c =>
    (c.make.toLowerCase().includes(search) ||
     c.model.toLowerCase().includes(search)) &&
    Number(c.price) >= min &&
    Number(c.price) <= max
  );

  const sort = document.getElementById("sort").value;

  if (sort === "high") filtered.sort((a, b) => b.price - a.price);
  if (sort === "low") filtered.sort((a, b) => a.price - b.price);

  list.innerHTML = "";

  filtered.forEach(car => {
    const isFav = favorites.includes(car.id);

    list.innerHTML += `
      <div class="col-md-4">
        <div class="card p-3 shadow-sm mb-3">

          <img src="${car.image}" onerror="this.src='https://via.placeholder.com/300'">

          <h5>${car.make} ${car.model}</h5>
          <p>Year: ${car.year}</p>
          <p><b>€${car.price}</b></p>

          <div class="d-flex gap-2 flex-wrap">

            <button class="btn btn-primary btn-sm" onclick="editCar(${car.id})">Edit</button>

            <button class="btn btn-danger btn-sm" onclick="deleteCar(${car.id})">Delete</button>

            <button class="btn btn-dark btn-sm" onclick="showDetails(${car.id})">Details</button>

            <button class="btn btn-warning btn-sm" onclick="toggleFavorite(${car.id})">
              ${isFav ? "⭐" : "☆"}
            </button>

          </div>
        </div>
      </div>
    `;
  });
}

function clearForm() {
  document.getElementById("make").value = "";
  document.getElementById("model").value = "";
  document.getElementById("year").value = "";
  document.getElementById("price").value = "";
  document.getElementById("image").value = "";
}

displayCars();
*/

let cars      = JSON.parse(localStorage.getItem("cars"))      || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let users     = JSON.parse(localStorage.getItem("users"))     || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

let editId    = null;
let activeTab = 'all';

// ─── i18n ──────────────────────────────────────────────────────────────
const i18nCache = { en: {} };
let currentLang = 'en';

const DEFAULT_LABELS = 
{
  make:             "Make",
  model:            "Model",
  year:             "Year",
  price:            "Price (€)",
  image_url:        "Image URL",
  save_vehicle:     "Save Vehicle",
  min_price:        "Min Price",
  max_price:        "Max Price",
  total_cars:       "Total Cars",
  favorites:        "Favorites",
  avg_price:        "Avg Price",
  all_cars:         "All Cars",
  favorites_tab:    "Favorites",
  sort_default:     "Sort",
  sort_high:        "Price: High → Low",
  sort_low:         "Price: Low → High",
  search_placeholder: "Search make or model…",
  login:            "Login",
};


// keto jane per translationin e gjuhes shqip ita deuthch po pertoja tvija me shume 

const BUILTIN_TRANSLATIONS = 
{
  sq: {
    make: "Marka", model: "Modeli", year: "Viti", price: "Çmimi (€)",
    image_url: "URL e Imazhit", save_vehicle: "Ruaj Automjetin",
    min_price: "Çmimi Min", max_price: "Çmimi Max",
    total_cars: "Gjithsej Makina", favorites: "Preferuara", avg_price: "Çmimi Mesatar",
    all_cars: "Të gjitha", favorites_tab: "Preferuara",
    sort_default: "Rendit", sort_high: "Çmimi: Lartë → Ulët", sort_low: "Çmimi: Ulët → Lartë",
    search_placeholder: "Kërko markë ose model…", login: "Hyrje",
  },
  de: {
    make: "Marke", model: "Modell", year: "Jahr", price: "Preis (€)",
    image_url: "Bild-URL", save_vehicle: "Fahrzeug speichern",
    min_price: "Mindestpreis", max_price: "Höchstpreis",
    total_cars: "Autos gesamt", favorites: "Favoriten", avg_price: "Durchschnittspreis",
    all_cars: "Alle Autos", favorites_tab: "Favoriten",
    sort_default: "Sortieren", sort_high: "Preis: Hoch → Niedrig", sort_low: "Preis: Niedrig → Hoch",
    search_placeholder: "Marke oder Modell suchen…", login: "Anmelden",
  },
  it: {
    make: "Marca", model: "Modello", year: "Anno", price: "Prezzo (€)",
    image_url: "URL Immagine", save_vehicle: "Salva Veicolo",
    min_price: "Prezzo Min", max_price: "Prezzo Max",
    total_cars: "Auto Totali", favorites: "Preferiti", avg_price: "Prezzo Medio",
    all_cars: "Tutte le Auto", favorites_tab: "Preferiti",
    sort_default: "Ordina", sort_high: "Prezzo: Alto → Basso", sort_low: "Prezzo: Basso → Alto",
    search_placeholder: "Cerca marca o modello…", login: "Accedi",
  },
};

Object.assign(i18nCache, BUILTIN_TRANSLATIONS);

// 
async function loadLanguages() 
{
  try {
    const res = await fetch('https://ai-translate.p.rapidapi.com/languages', {
      method: 'GET',
      headers: {
        'x-rapidapi-key':  '5392e1a9d2msh002ce32271bb8a0p15321fjsn614806c2118d',
        'x-rapidapi-host': 'ai-translate.p.rapidapi.com',
        'Content-Type':    'application/json'
      }
    });

    const data = await res.json();
    const langList = Array.isArray(data) ? data : (data.languages || data.data || []);

    // Only update status — the select already has our 4 languages hardcoded
    document.getElementById('langStatus').textContent = `${langList.length} languages available`;
    showToast('🌐 Language API connected');
  } catch (err) {
    document.getElementById('langStatus').textContent = '4 languages';
    console.warn('Language API info:', err);
  }
}

async function translateText(texts, targetLang) {
  try {
    const res = await fetch('https://ai-translate.p.rapidapi.com/translate', {
      method: 'POST',
      headers: {
        'x-rapidapi-key':  '5392e1a9d2msh002ce32271bb8a0p15321fjsn614806c2118d',
        'x-rapidapi-host': 'ai-translate.p.rapidapi.com',
        'Content-Type':    'application/json'
      },
      body: JSON.stringify({ texts, tl: targetLang, sl: 'en' })
    });
    const data = await res.json();
    return data.texts || data.translations || texts;
  } catch {
    return texts;
  }
}

async function applyLanguage()
 {
  const lang = document.getElementById('langSelect').value;
  currentLang = lang;

  if (lang === 'en') {
    applyLabels(DEFAULT_LABELS);
    document.getElementById('langStatus').textContent = '4 languages';
    return;
  }


  if (i18nCache[lang]) 
    {
    applyLabels(i18nCache[lang]);
    document.getElementById('langStatus').textContent = `✓ ${lang.toUpperCase()}`;
    showToast(`🌐 Language: ${lang.toUpperCase()}`);
    return;
  }

  // Fallback: try API translation
  document.getElementById('langStatus').textContent = 'Translating…';
  const keys   = Object.keys(DEFAULT_LABELS);
  const values = Object.values(DEFAULT_LABELS);
  const translated = await translateText(values, lang);

  const map = {};
  keys.forEach((k, i) => { map[k] = translated[i] || values[i]; });
  i18nCache[lang] = map;

  applyLabels(map);
  document.getElementById('langStatus').textContent = `✓ ${lang.toUpperCase()}`;
  showToast(`🌐 UI translated to ${lang.toUpperCase()}`);
}

function applyLabels(labels) 
{
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (labels[key]) el.textContent = labels[key];
  });
  const searchInput = document.getElementById('search');
  if (labels.search_placeholder) searchInput.placeholder = labels.search_placeholder;
}


//kjo a per nje future auth..  po su desh e lejme heqim  por pash qe gr. e tjera e kishin ber 
function doLogin() 
{
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value.trim();

  if (!email || !pass) { showToast('⚠ Fill in email and password', true); return; }

  const user = users.find(u => u.email === email && u.password === pass);
  if (!user) { showToast('❌ invalid email or password', true); return; }

  currentUser = { name: user.name, email: user.email };
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  closeModal('loginModal');
  updateLoginBtn();
  showToast(`👋 Welcome back!, ${user.name}!`);
}

function doRegister() 
{
  const name  = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass  = document.getElementById('reg-pass').value.trim();

  if (!name || !email || !pass) { showToast('⚠ Fill all fields', true); return; }
  if (users.find(u => u.email === email)) { showToast('⚠ Email already registered', true); return; }

  users.push({ name, email, password: pass });
  localStorage.setItem('users', JSON.stringify(users));

  currentUser = { name, email };
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  closeModal('loginModal');
  updateLoginBtn();
  showToast(`🎉 Account created! Welcome, ${name}!`);
}

function doLogout()
 {
  currentUser = null;
  localStorage.removeItem('currentUser');
  updateLoginBtn();
  showToast('👋 Logged out');
}

function updateLoginBtn() 
{
  const btn = document.querySelector('.btn-login');
  if (currentUser) 
    {
    btn.innerHTML = `
      <div class="user-avatar">${currentUser.name.charAt(0).toUpperCase()}</div>
      <span>${currentUser.name}</span>
    `;
    btn.classList.add('logged-in');
    btn.onclick = doLogout;
  }

   else 
    {
    btn.innerHTML = `👤 <span data-i18n="login">Login</span>`;
    btn.classList.remove('logged-in');
    btn.onclick = () => openModal('loginModal');
  }
}

function showRegister() 
{
  document.getElementById('loginView').style.display    = 'none';
  document.getElementById('registerView').style.display = 'block';
  return false;
}

function showLogin()
 {
  document.getElementById('registerView').style.display = 'none';
  document.getElementById('loginView').style.display    = 'block';
  return false;
}

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

function updateFavBadge() 
{
  document.getElementById('headerFavCount').textContent = favorites.length;
}

function displayCars()
 {
  const list   = document.getElementById("carList");
  const search = document.getElementById("search").value.toLowerCase();
  const min    = Number(document.getElementById("minPrice").value);
  const max    = Number(document.getElementById("maxPrice").value);
  const sort   = document.getElementById("sort").value;

  document.getElementById("minVal").textContent = `€${min.toLocaleString()}`;
  document.getElementById("maxVal").textContent = `€${max.toLocaleString()}`;

  let filtered = cars.filter(c =>
 {
    const matchSearch = c.make.toLowerCase().includes(search) || c.model.toLowerCase().includes(search);
    const p           = Number(c.price);
    const matchPrice  = p >= min && p <= max;
    const matchTab    = activeTab === 'all' || favorites.includes(c.id);
    return matchSearch && matchPrice && matchTab;
  });

  if (sort === "high")   filtered.sort((a, b) => Number(b.price) - Number(a.price));
  if (sort === "low")    filtered.sort((a, b) => Number(a.price) - Number(b.price));
  if (sort === "newest") filtered.sort((a, b) => Number(b.year)  - Number(a.year));

  // Stats
  document.getElementById('statTotal').textContent = cars.length;
  document.getElementById('statFavs').textContent  = favorites.length;
  updateFavBadge();

  const avg = cars.length
    ? Math.round(cars.reduce((s, c) => s + Number(c.price), 0) / cars.length)
    : 0;
  document.getElementById('statAvg').textContent = cars.length ? `€${avg.toLocaleString()}` : '—';

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🚗</div>
        <h3>${activeTab === 'fav' ? 'No Favorites Yet' : 'No Cars Found'}</h3>
        <p>${activeTab === 'fav' ? 'Star a car to add it here.' : 'Add your first car using the form.'}</p>
      </div>`;
    return;
  }

  list.innerHTML = filtered.map(car => {
    const isFav = favorites.includes(car.id);
    return `
      <div class="car-card ${isFav ? 'is-favorite' : ''}">
        <div class="card-img-wrap">
          <img src="${car.image}"
            onerror="this.src='https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80'"
            alt="${car.make} ${car.model}">
          <button class="fav-badge ${isFav ? 'active' : ''}"
            onclick="toggleFavorite(${car.id})"
            title="${isFav ? 'Remove favorite' : 'Add to favorites'}">
            ${isFav ? '⭐' : '☆'}
          </button>
        </div>
        <div class="card-body">
          <div class="card-make">${car.make}</div>
          <div class="card-model">${car.model}</div>
          <div class="card-meta">
            <span>📅 ${car.year}</span>
            ${isFav ? '<span class="fav-only-label">★ FAV</span>' : ''}
          </div>
          <div class="card-price">€${Number(car.price).toLocaleString()}</div>
          <div class="card-actions">
            <button class="btn-sm btn-edit"    onclick="editCar(${car.id})">✏ Edit</button>
            <button class="btn-sm btn-details" onclick="showDetails(${car.id})">🔍 Details</button>
            <button class="btn-sm btn-delete"  onclick="deleteCar(${car.id})">🗑</button>
          </div>
        </div>
      </div>`;
  }).join('');
}

function switchTab(tab, btn) 
{
  activeTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  displayCars();
}

function openModal(id) 
{
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id)
 {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.modal-overlay').forEach(overlay =>
   {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
  }
});

function clearForm() {
  ['make','model','year','price','image'].forEach(id => {
    document.getElementById(id).value = '';
  });
}

function showToast(msg, isError = false)
 {
  const container = document.getElementById('toastContainer');
  const toast     = document.createElement('div');
  toast.className = `toast${isError ? ' error' : ''}`;
  toast.textContent = msg;
  container.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

displayCars();
updateLoginBtn();
loadLanguages();