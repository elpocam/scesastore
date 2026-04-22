/* ═══════════════════════════════════════════════════════════
   SecureZone — app.js
   Lógica completa: productos, carrito, auth, checkout, UI
═══════════════════════════════════════════════════════════ */

'use strict';

const PRODUCT_CATEGORY_META = {
  Camaras: { brand: 'VIVOTEK', image: 'img/vivotek.png', satKey: '46171610', warrantyMonths: 12, modelPrefix: 'CAM' },
  Routers: { brand: 'TP-LINK', image: 'img/tplink.png', satKey: '43222609', warrantyMonths: 24, modelPrefix: 'RTR' },
  NVR: { brand: 'TOSHIBA', image: 'img/toshiba.png', satKey: '46171621', warrantyMonths: 18, modelPrefix: 'NVR' },
  Alarmas: { brand: 'DSC', image: 'img/dsc.png', satKey: '46171604', warrantyMonths: 12, modelPrefix: 'ALM' },
  Control: { brand: 'COMMAX', image: 'img/commax.png', satKey: '46171619', warrantyMonths: 12, modelPrefix: 'CTRL' },
  Accesorios: { brand: 'SAXXON', image: 'img/SAXXON.png', satKey: '39121006', warrantyMonths: 6, modelPrefix: 'ACC' }
};

/* ══════════════════════════════
   1. DATOS — PRODUCTOS
══════════════════════════════ */
function normalizeProductCatalog(catalog) {
  return catalog.map((product) => {
    const categoryMeta = PRODUCT_CATEGORY_META[product.category] || {};
    const technicalDetails = product.technicalDetails || Object.entries(product.specs || {})
      .map(([key, value]) => `${key}: ${value}`);

    return {
      ...product,
      stock: Number.isFinite(Number(product.stock)) ? Number(product.stock) : null,
      brand: product.brand || categoryMeta.brand || 'SCESA',
      model: product.model || `${categoryMeta.modelPrefix || 'PRD'}-${String(product.id).padStart(4, '0')}`,
      tvcKey: product.tvcKey || `sz${String(product.id).padStart(7, '0')}`,
      satKey: product.satKey || categoryMeta.satKey || '46171619',
      warrantyMonths: product.warrantyMonths || categoryMeta.warrantyMonths || 12,
      image: product.image || categoryMeta.image || 'img/commax.png',
      fullDescription: product.fullDescription || `${product.desc} Este producto ahora puede renderizarse en una vista de detalle completa sin recargar la página, conservando el estilo actual de la tienda.`,
      technicalDetails
    };
  });
}

const PRODUCTS = normalizeProductCatalog([
  {
    id: 1, name: 'Camara IP Domo 4K Pro', category: 'Camaras',
    price: 2499, originalPrice: 2999, emoji: '📷',
    desc: 'Resolución 4K Ultra HD, visión nocturna a color, detección de movimiento con IA, IP67.',
    stars: 4.9, reviews: 128, badge: 'Más vendido',
    specs: { 'Resolución': '4K / 8MP', 'Visión Nocturna': '30 metros', 'Conectividad': 'WiFi + PoE', 'Grado IP': 'IP67' },
    featured: true
  },
  {
    id: 2, name: 'Router Mesh WiFi 6 AX3000', category: 'Routers',
    price: 1899, originalPrice: 2299, emoji: '📡',
    desc: 'Cobertura de 250m², velocidad AX3000, hasta 200 dispositivos simultáneos, WPA3.',
    stars: 4.8, reviews: 87, badge: 'Nuevo',
    specs: { 'Estándar': 'WiFi 6 (802.11ax)', 'Velocidad': '3000 Mbps', 'Cobertura': '250 m²', 'Puertos': '4x Gigabit LAN' },
    featured: true
  },
  {
    id: 3, name: 'NVR 16 Canales 4K', category: 'NVR',
    price: 4299, originalPrice: 4999, emoji: '💾',
    desc: 'Grabador de red 16 canales, compatible H.265+, soporta hasta 16TB, acceso remoto.',
    stars: 4.7, reviews: 54,
    specs: { 'Canales': '16', 'Almacenamiento': 'Hasta 16TB', 'Codificación': 'H.265+', 'Salida Video': 'HDMI 4K' },
    featured: true
  },
  {
    id: 4, name: 'Camara PTZ 360° Outdoor', category: 'Camaras',
    price: 3199, originalPrice: null, emoji: '🎥',
    desc: 'Paneo/inclinación motorizado 360°, zoom óptico 20x, seguimiento automático de personas.',
    stars: 4.8, reviews: 43, badge: 'Premium',
    specs: { 'Zoom Óptico': '20x', 'Rotación': '360° Pan', 'Resolución': '5MP', 'Seguimiento': 'Automático IA' },
    featured: true
  },
  {
    id: 5, name: 'Router VPN Empresarial AC5400', category: 'Routers',
    price: 3599, originalPrice: 3999, emoji: '🌐',
    desc: 'Tri-banda AC5400, servidor VPN integrado, QoS avanzado, ideal para oficinas y PYMES.',
    stars: 4.6, reviews: 31,
    specs: { 'Estándar': 'AC5400 Tri-banda', 'VPN': 'OpenVPN / IPSec', 'CPU': 'Quad-core 1.8GHz', 'RAM': '512MB' },
    featured: false
  },
  {
    id: 6, name: 'Sistema de Alarma WiFi 32 Zonas', category: 'Alarmas',
    price: 2799, originalPrice: 3199, emoji: '🚨',
    desc: 'Central WiFi/GSM, 32 zonas, notificaciones push, sirena de 110dB, monitoreo 24/7.',
    stars: 4.7, reviews: 62,
    specs: { 'Zonas': '32 cableadas / 128 inalámbricas', 'Conectividad': 'WiFi + 4G GSM', 'Sirena': '110 dB', 'Backup': 'Batería 12h' },
    featured: false
  },
  {
    id: 7, name: 'Lectora de Huella + Tarjeta RFID', category: 'Control',
    price: 1299, originalPrice: 1599, emoji: '🔐',
    desc: 'Control de acceso biométrico con 3000 usuarios, historial de eventos, apertura remota.',
    stars: 4.5, reviews: 78, badge: 'Oferta',
    specs: { 'Usuarios': '3,000', 'Tecnología': 'Huella + RFID 13.56MHz', 'Memoria': '100,000 registros', 'Interfaz': 'TCP/IP + RS485' },
    featured: false
  },
  {
    id: 8, name: 'Camara Interior Baby Monitor 2K', category: 'Camaras',
    price: 899, originalPrice: 1199, emoji: '👶',
    desc: 'Camara para interiores 2K, audio bidireccional, detector de llanto, app móvil incluida.',
    stars: 4.6, reviews: 95,
    specs: { 'Resolución': '2K (2304×1296)', 'Audio': 'Bidireccional', 'IA': 'Detector de llanto', 'App': 'iOS + Android' },
    featured: false
  },
  {
    id: 9, name: 'Switch PoE 24 Puertos Gigabit', category: 'Routers',
    price: 2199, originalPrice: 2499, emoji: '🔌',
    desc: 'Switch PoE+ 24 puertos Gigabit + 4 SFP uplink, presupuesto PoE 370W, administrable.',
    stars: 4.8, reviews: 22,
    specs: { 'Puertos': '24x PoE+ Gigabit + 4 SFP', 'PoE Budget': '370W', 'Conmutación': '48 Gbps', 'Administración': 'Web + SNMP' },
    featured: false
  },
  {
    id: 10, name: 'Kit 8 Camaras + NVR 4K', category: 'NVR',
    price: 12999, originalPrice: 15999, emoji: '📦',
    desc: 'Kit completo: 8 camaras 4K bullet exterior + NVR 8ch + disco duro 2TB preinstalado.',
    stars: 4.9, reviews: 147, badge: 'Kit',
    specs: { 'Camaras': '8x Bullet 4K IP67', 'Grabador': 'NVR 8 canales', 'Almacenamiento': 'HDD 2TB incluido', 'Garantía': '2 años' },
    featured: true
  },
  {
    id: 11, name: 'Sensor de Movimiento PIR Inalámbrico', category: 'Alarmas',
    price: 349, originalPrice: 499, emoji: '👁️',
    desc: 'Sensor infrarrojo pasivo, alcance 12m, ángulo 90°, batería 3 años, compatible con cualquier central.',
    stars: 4.4, reviews: 156,
    specs: { 'Alcance': '12 metros', 'Ángulo': '90°', 'Batería': '3 años', 'Frecuencia': '433MHz' },
    featured: false
  },
  {
    id: 12, name: 'Cerradura Biométrica Smart', category: 'Control',
    price: 2899, originalPrice: 3299, emoji: '🔒',
    desc: 'Cerradura digital con huella, código PIN, tarjeta RFID, app y llave mecánica de emergencia.',
    stars: 4.7, reviews: 89, badge: 'Nuevo',
    specs: { 'Modos': 'Huella / PIN / RFID / App / Llave', 'Usuarios': '200 huellas', 'Alarma': 'Anti-manipulación', 'Certificación': 'ANSI Grade 2' },
    featured: false
  },
  {
    id: 13, name: 'Cable UTP Cat6 305m', category: 'Accesorios',
    price: 699, originalPrice: 899, emoji: '🔧',
    desc: 'Bobina de 305 metros cable UTP Cat6 23AWG para instalaciones de red y camaras IP.',
    stars: 4.3, reviews: 201,
    specs: { 'Categoría': 'Cat6 / UTP', 'Conductor': '23 AWG puro cobre', 'Longitud': '305 metros', 'CMR': 'Certificado' },
    featured: false
  },
  {
    id: 14, name: 'Soporte Universal Camara 360°', category: 'Accesorios',
    price: 199, originalPrice: 299, emoji: '🗜️',
    desc: 'Soporte metálico articulado, compatible con camaras hasta 5kg, instalación en techo o pared.',
    stars: 4.5, reviews: 318,
    specs: { 'Material': 'Acero galvanizado', 'Carga máx.': '5 kg', 'Articulación': '360° horizontal / 90° vertical', 'Incluye': 'Tornillería completa' },
    featured: false
  },
  {
    id: 15, name: 'Fuente Switching 12V 10A CCTV', category: 'Accesorios',
    price: 449, originalPrice: 599, emoji: '⚡',
    desc: 'Fuente de alimentación regulada 12V 10A con 8 salidas para distribución de camaras CCTV.',
    stars: 4.6, reviews: 134,
    specs: { 'Salida': '12V DC / 10A', 'Canales': '8 salidas con fusible', 'Entrada': 'AC 100-240V', 'Protección': 'Cortocircuito / Sobrecarga' },
    featured: false
  },
]);

/* ══════════════════════════════
   2. ESTADO GLOBAL
══════════════════════════════ */
const State = {
  cart: JSON.parse(localStorage.getItem('sz_cart') || '[]'),
  user: JSON.parse(localStorage.getItem('sz_user') || 'null'),
  users: JSON.parse(localStorage.getItem('sz_users') || '[]'),
  currentFilter: 'Todos',
  currentProductId: null,
  currentPage: 'home',
  shippingData: null,
};

/* ══════════════════════════════
   3. PERSISTENCIA
══════════════════════════════ */
function saveCart()  { localStorage.setItem('sz_cart', JSON.stringify(State.cart)); }
function saveUser()  { localStorage.setItem('sz_user', JSON.stringify(State.user)); }
function saveUsers() { localStorage.setItem('sz_users', JSON.stringify(State.users)); }

function replaceProducts(nextProducts) {
  PRODUCTS.length = 0;
  PRODUCTS.push(...normalizeProductCatalog(nextProducts));
}

function extractProductsJsonFromHtml(html) {
  const match = html.match(/<script id="productsDataSource" type="application\/json">([\s\S]*?)<\/script>/i);
  return match ? match[1].trim() : '';
}

async function syncProductsCatalog() {
  try {
    const inlineSource = document.getElementById('productsDataSource');
    let jsonText = inlineSource?.textContent?.trim() || '';

    if (!jsonText) {
      const response = await fetch('partials/products.html');
      if (!response.ok) return false;
      jsonText = extractProductsJsonFromHtml(await response.text());
    }

    if (!jsonText) return false;
    const parsed = JSON.parse(jsonText);
    if (!Array.isArray(parsed) || !parsed.length) return false;
    replaceProducts(parsed);
    return true;
  } catch (error) {
    return false;
  }
}

const PARTIAL_PAGES = new Set(['products', 'about', 'contact']);
const loadedPartials = new Set();

/* ══════════════════════════════
   4. NAVEGACIÓN DE PÁGINAS
══════════════════════════════ */
async function loadPagePartial(pageId) {
  if (!PARTIAL_PAGES.has(pageId) || loadedPartials.has(pageId)) return true;

  const target = document.getElementById('page-' + pageId);
  const partialPath = target?.dataset.partial;
  if (!target || !partialPath) return false;

  try {
    const response = await fetch(partialPath);
    if (!response.ok) throw new Error(`No se pudo cargar ${partialPath}`);
    target.innerHTML = await response.text();
    loadedPartials.add(pageId);
    return true;
  } catch (error) {
    target.innerHTML = `
      <div class="section">
        <div class="container">
          <div class="no-results" style="display:block">
            <i class="fas fa-triangle-exclamation"></i>
            <p>No se pudo cargar esta secciÃ³n.</p>
          </div>
        </div>
      </div>
    `;
    return false;
  }
}

async function showPage(pageId, options = {}) {
  await loadPagePartial(pageId);

  const shouldScrollTop = options.scrollTop !== false;

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageId);
  if (target) {
    target.classList.add('active');
    State.currentPage = pageId;
    if (shouldScrollTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  // Cerrar menú móvil si está abierto
  document.getElementById('navLinks').classList.remove('open');

  // Acciones especiales por página
  if (pageId === 'products') {
    await syncProductsCatalog();
    renderFeatured();
    renderProducts();
  }
  if (pageId === 'checkout') renderCheckoutSummary();
}

/* ══════════════════════════════
   5. NAVBAR — MENÚ MÓVIL
══════════════════════════════ */
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

/* ══════════════════════════════
   6. RENDERIZAR PRODUCTOS
══════════════════════════════ */
function createProductCard(product) {
  const badgeHtml = product.badge && product.badge !== 'Oferta'
    ? `<div class="badge-new">${product.badge}</div>`
    : '';

  const starsHtml = '★'.repeat(Math.round(product.stars)) + '☆'.repeat(5 - Math.round(product.stars));

  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <div class="product-img" onclick="openProductModal(${product.id})">
      <span>${product.emoji}</span>
      ${badgeHtml}
    </div>
    <div class="product-info">
      <div class="product-cat">${product.category}</div>
      <div class="product-name">${product.name}</div>
      <div class="product-desc">${product.desc}</div>
      <div class="product-stars">
        ${starsHtml}
        <span>(${product.reviews})</span>
      </div>
      <div class="product-footer">
        <div class="product-price">
          $${product.price.toLocaleString()}
        </div>
        <button class="btn-add" onclick="addToCart(${product.id}, event)">
          <i class="fas fa-plus"></i> Agregar
        </button>
      </div>
    </div>
  `;
  return card;
}

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  const noResults = document.getElementById('noResults');
  const search = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const sort = document.getElementById('sortSelect')?.value || 'default';

  let filtered = PRODUCTS.filter(p => {
    const matchCat = State.currentFilter === 'Todos' || p.category === State.currentFilter;
    const matchSearch = !search || p.name.toLowerCase().includes(search) || p.desc.toLowerCase().includes(search);
    return matchCat && matchSearch;
  });

  if (sort === 'price-asc')  filtered.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  if (sort === 'name')       filtered.sort((a, b) => a.name.localeCompare(b.name));

  grid.innerHTML = '';
  if (filtered.length === 0) {
    noResults.style.display = 'block';
  } else {
    noResults.style.display = 'none';
    filtered.forEach(p => grid.appendChild(createProductCard(p)));
  }
}

function renderFeatured() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  PRODUCTS.filter(p => p.featured).slice(0, 4).forEach(p => grid.appendChild(createProductCard(p)));
}

function setFilter(cat, btn) {
  State.currentFilter = cat;
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderProducts();
}

function filterProducts() {
  renderProducts();
}

async function filterCategory(cat) {
  State.currentFilter = cat;
  await showPage('products');
  // Activar el tab correcto
  document.querySelectorAll('.filter-tab').forEach(t => {
    t.classList.toggle('active', t.textContent.trim() === cat);
  });
  renderProducts();
}

/* ══════════════════════════════
   7. MODAL DE PRODUCTO
══════════════════════════════ */
function openProductModal(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  const specsHtml = Object.entries(p.specs)
    .map(([k, v]) => `<div class="spec-item"><strong>${k}</strong>${v}</div>`)
    .join('');
  const starsHtml = '★'.repeat(Math.round(p.stars)) + '☆'.repeat(5 - Math.round(p.stars));

  document.getElementById('modalContent').innerHTML = `
    <div class="modal-product-img">${p.emoji}</div>
    <div class="modal-product-cat">${p.category}</div>
    <h2 class="modal-product-name">${p.name}</h2>
    <div class="product-stars" style="margin-bottom:1rem">${starsHtml} <span style="color:var(--text2);font-size:.82rem">${p.stars} · ${p.reviews} reseñas</span></div>
    <p class="modal-product-desc">${p.desc}</p>
    <div class="modal-specs">${specsHtml}</div>
    <div class="modal-footer">
      <div class="modal-price">
        $${p.price.toLocaleString()}
      </div>
      <button class="btn-accent" onclick="addToCart(${p.id}); closeProductModal()">
        <i class="fas fa-bag-shopping"></i> Agregar al carrito
      </button>
    </div>
  `;

  document.getElementById('productModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('open');
  document.body.style.overflow = '';
}

function closeModal(e) {
  if (e.target === document.getElementById('productModal')) closeProductModal();
}

/* ══════════════════════════════
   8. CARRITO
══════════════════════════════ */
function getProductById(id) {
  return PRODUCTS.find(product => product.id === Number(id));
}

function getStarsHtml(stars) {
  return '★'.repeat(Math.round(stars)) + '☆'.repeat(5 - Math.round(stars));
}

function updateFilterTabs(activeCategory = 'Todos') {
  document.querySelectorAll('.filter-tab').forEach(tab => {
    const label = tab.textContent.trim();
    const isMatch = label === activeCategory || (activeCategory === 'NVR' && label === 'NVR/DVR');
    tab.classList.toggle('active', isMatch);
  });
}

function toggleProductsView(view) {
  const listView = document.getElementById('productsListView');
  const detailView = document.getElementById('productDetailView');
  if (!listView || !detailView) return;

  listView.style.display = view === 'detail' ? 'none' : 'block';
  detailView.style.display = view === 'detail' ? 'block' : 'none';
}

function createProductCard(product) {
  const badgeHtml = product.badge && product.badge !== 'Oferta'
    ? `<div class="badge-new">${product.badge}</div>`
    : '';
  const originalPriceHtml = product.originalPrice
    ? `<del>$${product.originalPrice.toLocaleString()}</del>`
    : '';
  const stockHtml = product.stock !== null
    ? `<div class="product-meta-inline">Existencias: ${product.stock}</div>`
    : `<div class="product-meta-inline">${product.brand} · ${product.model}</div>`;

  const card = document.createElement('article');
  card.className = 'product-card';
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.onclick = () => openProductDetail(product.id);
  card.onkeydown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProductDetail(product.id);
    }
  };
  card.innerHTML = `
    <div class="product-img">
      <img src="${product.image}" alt="${product.name}" loading="lazy" />
      ${badgeHtml}
    </div>
    <div class="product-info">
      <div class="product-cat">${product.category}</div>
      <div class="product-name">${product.name}</div>
      ${stockHtml}
      <div class="product-desc">${product.desc}</div>
      <div class="product-stars">
        ${getStarsHtml(product.stars)}
        <span>(${product.reviews})</span>
      </div>
      <div class="product-footer">
        <div class="product-price">
          ${originalPriceHtml}
          $${product.price.toLocaleString()}
        </div>
        <button class="btn-add" onclick="openProductDetail(${product.id}, event)">
          <i class="fas fa-eye"></i> Ver detalle
        </button>
      </div>
    </div>
  `;
  return card;
}

function renderProducts() {
  if (State.currentProductId) {
    renderProductDetail(State.currentProductId);
    return;
  }

  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  const noResults = document.getElementById('noResults');
  const search = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const sort = document.getElementById('sortSelect')?.value || 'default';

  toggleProductsView('list');

  let filtered = PRODUCTS.filter((product) => {
    const matchCat = State.currentFilter === 'Todos' || product.category === State.currentFilter;
    const matchSearch = !search
      || product.name.toLowerCase().includes(search)
      || product.desc.toLowerCase().includes(search)
      || product.brand.toLowerCase().includes(search)
      || product.model.toLowerCase().includes(search)
      || product.tvcKey.toLowerCase().includes(search)
      || product.satKey.toLowerCase().includes(search)
      || product.fullDescription.toLowerCase().includes(search)
      || product.technicalDetails.some(detail => detail.toLowerCase().includes(search));
    return matchCat && matchSearch;
  });

  if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  if (sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));

  grid.innerHTML = '';
  if (filtered.length === 0) {
    noResults.style.display = 'block';
  } else {
    noResults.style.display = 'none';
    filtered.forEach(product => grid.appendChild(createProductCard(product)));
  }
}

function renderFeatured() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  grid.innerHTML = '';
  PRODUCTS
    .filter(product => product.featured)
    .slice(0, 4)
    .forEach(product => grid.appendChild(createProductCard(product)));
}

function renderProductDetail(id) {
  const product = getProductById(id);
  const detailView = document.getElementById('productDetailView');
  if (!detailView) return;

  if (!product) {
    State.currentProductId = null;
    renderProducts();
    return;
  }

  const specsHtml = Object.entries(product.specs || {})
    .map(([key, value]) => `
      <div class="detail-spec-item">
        <span>${key}</span>
        <strong>${value}</strong>
      </div>
    `)
    .join('');

  const technicalHtml = product.technicalDetails
    .map(detail => `<li>${detail}</li>`)
    .join('');

  const originalPriceHtml = product.originalPrice
    ? `<span class="detail-old-price">$${product.originalPrice.toLocaleString()}</span>`
    : '';

  detailView.innerHTML = `
    <button class="detail-back-btn" onclick="showProductsList()">
      <i class="fas fa-arrow-left"></i> Regresar a todos los productos
    </button>

    <div class="product-detail-shell">
      <div class="product-detail-hero">
        <div class="product-detail-media">
          <div class="product-detail-image-wrap">
            <img src="${product.image}" alt="${product.name}" class="product-detail-image" />
          </div>
        </div>

        <div class="product-detail-main">
          <div class="product-detail-topline">
            <span class="product-cat">${product.category}</span>
            ${product.badge ? `<span class="detail-chip">${product.badge}</span>` : ''}
          </div>
          <h2 class="product-detail-title">${product.name}</h2>
          <div class="product-stars product-detail-stars">
            ${getStarsHtml(product.stars)}
            <span>${product.stars} · ${product.reviews} reseñas</span>
          </div>
          <p class="product-detail-summary">${product.desc}</p>

          <div class="product-detail-price-row">
            ${originalPriceHtml}
            <strong class="product-detail-price">$${product.price.toLocaleString()}</strong>
          </div>

          <div class="product-detail-actions">
            <button class="btn-accent" onclick="addToCart(${product.id}, event)">
              <i class="fas fa-bag-shopping"></i> Agregar al carrito
            </button>
            <button class="btn-ghost" onclick="showProductsList()">
              <i class="fas fa-grid-2"></i> Volver a la grilla
            </button>
          </div>
        </div>
      </div>

      <div class="product-detail-data">
        <div class="detail-data-card"><span>Información general</span><strong>${product.category} profesional</strong></div>
        <div class="detail-data-card"><span>Marca</span><strong>${product.brand}</strong></div>
        <div class="detail-data-card"><span>Modelo</span><strong>${product.model}</strong></div>
        <div class="detail-data-card"><span>Existencias</span><strong>${product.stock ?? 'Consultar'}</strong></div>
        <div class="detail-data-card"><span>Clave TVC</span><strong>${product.tvcKey}</strong></div>
        <div class="detail-data-card"><span>Clave SAT</span><strong>${product.satKey}</strong></div>
        <div class="detail-data-card"><span>Garantía</span><strong>${product.warrantyMonths} meses</strong></div>
      </div>

      <div class="product-detail-sections">
        <section class="detail-section-card">
          <h3>Descripción completa del producto</h3>
          <p>${product.fullDescription}</p>
        </section>

        <section class="detail-section-card">
          <h3>Especificaciones principales</h3>
          <div class="detail-spec-grid">${specsHtml}</div>
        </section>

        <section class="detail-section-card">
          <h3>Datos técnicos</h3>
          <ul class="detail-tech-list">${technicalHtml}</ul>
        </section>
      </div>
    </div>
  `;

  toggleProductsView('detail');
}

function setFilter(cat, btn) {
  State.currentProductId = null;
  State.currentFilter = cat;
  updateFilterTabs(cat);
  if (btn) btn.blur();
  renderProducts();
}

function filterProducts() {
  State.currentProductId = null;
  renderProducts();
}

async function filterCategory(cat) {
  State.currentProductId = null;
  State.currentFilter = cat;
  await showPage('products');
  updateFilterTabs(cat);
  renderProducts();
}

async function openProductDetail(id, event) {
  if (event) event.stopPropagation();
  State.currentProductId = Number(id);
  await showPage('products', { scrollTop: State.currentPage !== 'products' });
  renderProductDetail(id);
}

function showProductsList() {
  State.currentProductId = null;
  State.currentFilter = 'Todos';

  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  if (searchInput) searchInput.value = '';
  if (sortSelect) sortSelect.value = 'default';

  updateFilterTabs('Todos');
  renderProducts();
}

function openProductModal(id, event) {
  return openProductDetail(id, event);
}

function closeProductModal() {
  showProductsList();
}

function closeModal() {
  showProductsList();
}

function addToCart(productId, e) {
  if (e) e.stopPropagation();
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = State.cart.find(i => i.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    State.cart.push({ id: product.id, name: product.name, price: product.price, emoji: product.emoji, qty: 1 });
  }
  saveCart();
  updateCartUI();
  showToast(`${product.emoji} ${product.name} agregado al carrito`, 'success');
  pulseCartBtn();
}

function removeFromCart(productId) {
  State.cart = State.cart.filter(i => i.id !== productId);
  saveCart();
  updateCartUI();
}

function changeQty(productId, delta) {
  const item = State.cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(productId);
  else {
    saveCart();
    updateCartUI();
  }
}

function getCartSubtotal() {
  return State.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function getCartTotal() {
  return getCartSubtotal();
}

function updateCartUI() {
  const count = State.cart.reduce((s, i) => s + i.qty, 0);
  const countEl = document.getElementById('cartCount');
  countEl.textContent = count;
  countEl.style.display = count > 0 ? 'flex' : 'none';

  renderCartItems();
  updateCartTotals();
}

function renderCartItems() {
  const container = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');

  if (State.cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-bag-shopping"></i>
        <p>Tu carrito está vacío</p>
        <button class="btn-accent" onclick="showPage('products'); toggleCart()">Ver Productos</button>
      </div>`;
    footer.style.display = 'none';
    return;
  }

  footer.style.display = 'block';

  container.innerHTML = State.cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-emoji">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${(item.price * item.qty).toLocaleString()}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)"><i class="fas fa-minus"></i></button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)"><i class="fas fa-plus"></i></button>
        </div>
      </div>
      <button class="cart-item-del" onclick="removeFromCart(${item.id})" title="Eliminar">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `).join('');
}

function updateCartTotals() {
  const sub = getCartSubtotal();
  const total = getCartTotal();

  document.getElementById('cartSubtotal').textContent = `$${sub.toLocaleString()}`;
  document.getElementById('cartTotal').textContent = `$${Math.round(total).toLocaleString()}`;
}

function toggleCart() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  const isOpen = drawer.classList.contains('open');
  drawer.classList.toggle('open');
  overlay.classList.toggle('open');
  document.body.style.overflow = isOpen ? '' : 'hidden';
}

function pulseCartBtn() {
  const btn = document.querySelector('.cart-btn');
  btn.style.transform = 'scale(1.2)';
  btn.style.borderColor = 'var(--accent)';
  setTimeout(() => {
    btn.style.transform = '';
    btn.style.borderColor = '';
  }, 300);
}

function goToCheckout() {
  if (State.cart.length === 0) { showToast('Tu carrito está vacío', 'error'); return; }
  if (!State.user) {
    showToast('Inicia sesión para continuar con tu compra', 'info');
    toggleCart();
    setTimeout(() => showPage('login'), 300);
    return;
  }
  toggleCart();
  setTimeout(() => showPage('checkout'), 350);
}

/* ══════════════════════════════
   9. CHECKOUT
══════════════════════════════ */
function renderCheckoutSummary() {
  const container = document.getElementById('checkoutItems');
  if (!container) return;
  const sub = getCartSubtotal();
  const total = getCartTotal();

  container.innerHTML = State.cart.map(item => `
    <div class="checkout-item">
      <div class="checkout-item-emoji">${item.emoji}</div>
      <div class="checkout-item-name">${item.name}</div>
      <div class="checkout-item-qty">x${item.qty}</div>
      <div class="checkout-item-price">$${(item.price * item.qty).toLocaleString()}</div>
    </div>
  `).join('');

  document.getElementById('chkSubtotal').textContent = `$${sub.toLocaleString()}`;
  document.getElementById('chkTotal').textContent = `$${Math.round(total).toLocaleString()}`;

  // Pre-llenar datos si hay sesión
  if (State.user) {
    setTimeout(() => {
      const fn = document.getElementById('shipNombre');
      const fe = document.getElementById('shipEmail');
      if (fn) fn.value = State.user.nombre || '';
      if (fe) fe.value = State.user.email || '';
    }, 100);
  }

  goToStep(1);
}

function goToStep(step) {
  [1, 2, 3].forEach(n => {
    document.getElementById(`checkoutStep${n}`).style.display = n === step ? 'block' : 'none';
    const ind = document.getElementById(`step${n}indicator`);
    ind.classList.remove('active', 'done');
    if (n < step) ind.classList.add('done');
    else if (n === step) ind.classList.add('active');
  });
}

function goToPayment() {
  const form = document.getElementById('shippingForm');
  if (!form) return;

  // Validación manual
  const fields = ['shipNombre', 'shipApellido', 'shipEmail', 'shipTel', 'shipDir', 'shipCiudad', 'shipEstado', 'shipCP'];
  for (const fid of fields) {
    const el = document.getElementById(fid);
    if (!el || !el.value.trim()) {
      showToast('Por favor completa todos los campos de envío', 'error');
      el?.focus();
      return;
    }
  }

  State.shippingData = {
    nombre: document.getElementById('shipNombre').value,
    apellido: document.getElementById('shipApellido').value,
    email: document.getElementById('shipEmail').value,
    tel: document.getElementById('shipTel').value,
    direccion: document.getElementById('shipDir').value,
    ciudad: document.getElementById('shipCiudad').value,
    estado: document.getElementById('shipEstado').value,
    cp: document.getElementById('shipCP').value,
  };

  goToStep(2);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function processPayment() {
  const name = document.getElementById('cardName')?.value.trim();
  const num  = document.getElementById('cardNum')?.value.replace(/\s/g, '');
  const exp  = document.getElementById('cardExp')?.value;
  const cvv  = document.getElementById('cardCvv')?.value;

  if (!name || !num || !exp || !cvv) {
    showToast('Por favor completa todos los datos de pago', 'error');
    return;
  }
  if (num.length < 16) {
    showToast('Número de tarjeta inválido', 'error');
    return;
  }
  if (!exp.match(/^\d{2}\/\d{2}$/)) {
    showToast('Fecha de vencimiento inválida (MM/AA)', 'error');
    return;
  }
  if (cvv.length < 3) {
    showToast('CVV inválido', 'error');
    return;
  }

  // Simular procesamiento de pago
  const btn = document.querySelector('#checkoutStep2 .btn-submit');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span class="spinner"></span> Procesando...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.disabled = false;
    confirmOrder();
  }, 2200);
}

function confirmOrder() {
  const orderNum = 'SZ-' + Date.now().toString().slice(-7);
  document.getElementById('orderNumber').textContent = orderNum;

  const sd = State.shippingData;
  const total = Math.round(getCartTotal()).toLocaleString();
  document.getElementById('confirmDetails').innerHTML = `
    <strong>📦 Envío a:</strong><br>
    ${sd.nombre} ${sd.apellido}<br>
    ${sd.direccion}, ${sd.ciudad}, ${sd.estado} ${sd.cp}<br><br>
    <strong>📧 Confirmación enviada a:</strong> ${sd.email}<br>
    <strong>💳 Total cobrado:</strong> $${total} MXN<br>
    <strong>🚚 Tiempo de entrega:</strong> 2–4 días hábiles
  `;

  // Limpiar carrito
  State.cart = [];
  saveCart();
  updateCartUI();

  goToStep(3);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  showToast('¡Pago procesado exitosamente! 🎉', 'success');
}

/* ══════════════════════════════
   10. TARJETA DE CRÉDITO VISUAL
══════════════════════════════ */
function updateCard() {
  const name = document.getElementById('cardName')?.value || '';
  const num  = document.getElementById('cardNum')?.value || '';
  const exp  = document.getElementById('cardExp')?.value || '';

  const numDisplay = document.getElementById('cardNumDisplay');
  const nameDisplay = document.getElementById('cardNameDisplay');
  const expDisplay = document.getElementById('cardExpDisplay');

  if (numDisplay) {
    const cleaned = num.replace(/\s/g, '');
    const padded = cleaned.padEnd(16, '•');
    numDisplay.textContent = padded.replace(/(.{4})/g, '$1 ').trim();
  }
  if (nameDisplay) nameDisplay.textContent = name.toUpperCase() || 'NOMBRE APELLIDO';
  if (expDisplay) expDisplay.textContent = exp || 'MM/AA';
}

function formatCardNum(input) {
  let val = input.value.replace(/\D/g, '').slice(0, 16);
  input.value = val.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(input) {
  let val = input.value.replace(/\D/g, '').slice(0, 4);
  if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
  input.value = val;
}

/* ══════════════════════════════
   11. AUTENTICACIÓN
══════════════════════════════ */
// NUEVO handleRegister con backend
async function handleRegister(e) {
    e.preventDefault();
    
    const userData = {
        nombre: document.getElementById('regNombre').value.trim(),
        apellido: document.getElementById('regApellido').value.trim(),
        email: document.getElementById('regEmail').value.trim().toLowerCase(),
        tel: document.getElementById('regTel').value.trim(),
        pass: document.getElementById('regPass').value,
        wantsPromo: document.getElementById('regPromo').checked
    };
    
    const pass2 = document.getElementById('regPass2').value;
    const errEl = document.getElementById('registerError');
    
    if (userData.pass.length < 8) {
        errEl.querySelector('span').textContent = 'La contraseña debe tener al menos 8 caracteres.';
        errEl.style.display = 'flex';
        return;
    }
    if (userData.pass !== pass2) {
        errEl.querySelector('span').textContent = 'Las contraseñas no coinciden.';
        errEl.style.display = 'flex';
        return;
    }
    
    try {
        const response = await fetch('api/register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Guardar usuario en State (sin contraseña)
            State.user = result.user;
            saveUser();
            updateAuthUI();
            
            // También guardar en users local para compatibilidad
            const localUser = { ...result.user, pass: userData.pass };
            State.users.push(localUser);
            saveUsers();
            
            showToast(`¡Bienvenido/a ${result.user.nombre}! Tu cuenta fue creada exitosamente 🎉`, 'success');
            showPage('home');
        } else {
            errEl.querySelector('span').textContent = result.message;
            errEl.style.display = 'flex';
        }
    } catch (error) {
        errEl.querySelector('span').textContent = 'Error de conexión con el servidor';
        errEl.style.display = 'flex';
    }
}

// NUEVO handleLogin con backend
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    const errEl = document.getElementById('loginError');
    
    try {
        const response = await fetch('api/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const result = await response.json();
        
        if (result.success) {
            State.user = result.user;
            saveUser();
            
            // También sincronizar con users local
            const existingLocal = State.users.find(u => u.email === email);
            if (!existingLocal) {
                State.users.push({ ...result.user, pass: password });
                saveUsers();
            }
            
            updateAuthUI();
            showToast(`¡Hola de nuevo, ${result.user.nombre}! 👋`, 'success');
            showPage('home');
        } else {
            errEl.querySelector('span').textContent = result.message;
            errEl.style.display = 'flex';
        }
    } catch (error) {
        errEl.querySelector('span').textContent = 'Error de conexión con el servidor';
        errEl.style.display = 'flex';
    }
}
/* ══════════════════════════════
   12. FUERZA DE CONTRASEÑA
══════════════════════════════ */
function checkStrength(val) {
  const fill = document.getElementById('strengthFill');
  const label = document.getElementById('strengthLabel');
  if (!fill || !label) return;

  let score = 0;
  if (val.length >= 8)                   score++;
  if (/[A-Z]/.test(val))                 score++;
  if (/[0-9]/.test(val))                 score++;
  if (/[^A-Za-z0-9]/.test(val))         score++;

  const levels = [
    { pct: '25%', color: 'var(--error)', text: 'Muy débil' },
    { pct: '50%', color: 'var(--warning)', text: 'Débil' },
    { pct: '75%', color: 'var(--accent)', text: 'Buena' },
    { pct: '100%', color: 'var(--success)', text: 'Excelente' },
  ];

  const lvl = levels[Math.max(0, score - 1)];
  if (val.length === 0) {
    fill.style.width = '0'; label.textContent = '';
  } else {
    fill.style.width = lvl.pct;
    fill.style.background = lvl.color;
    label.textContent = lvl.text;
    label.style.color = lvl.color;
  }
}

/* ══════════════════════════════
   13. TOGGLE CONTRASEÑA
══════════════════════════════ */
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  const icon = btn.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.replace('fa-eye', 'fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.replace('fa-eye-slash', 'fa-eye');
  }
}

/* ══════════════════════════════
   14. CONTACTO
══════════════════════════════ */
function handleContact(e) {
  e.preventDefault();
  showToast('Mensaje enviado correctamente. Te contactaremos pronto 📬', 'success');
  e.target.reset();
}

/* ══════════════════════════════
   15. TOAST NOTIFICATIONS
══════════════════════════════ */
function showToast(message, type = 'info') {
  const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info' };
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${icons[type]}"></i><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('out');
    toast.addEventListener('animationend', () => toast.remove());
  }, 3500);
}

/* ══════════════════════════════
   16. SCROLL NAVBAR
══════════════════════════════ */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 30) {
    nav.style.boxShadow = '0 4px 30px rgba(0,0,0,.5)';
  } else {
    nav.style.boxShadow = 'none';
  }
});

/* ══════════════════════════════
   17. CERRAR CARRITO CON ESC
══════════════════════════════ */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (State.currentPage === 'products' && State.currentProductId) {
      showProductsList();
    } else if (document.getElementById('productModal').classList.contains('open')) {
      closeProductModal();
    } else if (document.getElementById('cartDrawer').classList.contains('open')) {
      toggleCart();
    }
  }
});

/* ══════════════════════════════
   18. INICIALIZACIÓN
══════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  await syncProductsCatalog();
  renderFeatured();
  updateCartUI();
  updateAuthUI();

  // Restaurar sesión si existe
  if (State.user) {
    updateAuthUI();
  }
});

/* ══════════════════════════════
   HERO CAROUSEL
══════════════════════════════ */
(function() {
  let current = 0;
  const total = 4;
  let autoTimer = null;

  function getTrack() { return document.getElementById('heroTrack'); }
  function getDots()  { return document.querySelectorAll('#heroDots .dot'); }

  function goTo(index) {
    const track = getTrack();
    if (!track) return;
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    getDots().forEach((d, i) => d.classList.toggle('active', i === current));
  }

  window.heroSlide = function(dir) { goTo(current + dir); resetTimer(); };
  window.heroGoTo  = function(i)   { goTo(i); resetTimer(); };

  function resetTimer() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 5500);
  }

  document.addEventListener('DOMContentLoaded', function() {
    resetTimer();
    // Touch/swipe support
    const carousel = document.getElementById('heroCarousel');
    if (!carousel) return;
    let startX = 0;
    carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { goTo(current + (diff > 0 ? 1 : -1)); resetTimer(); }
    }, { passive: true });
  });
})();
