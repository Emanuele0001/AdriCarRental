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
