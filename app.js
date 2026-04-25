/* ═══════════════════════════════════════════════════════════
   SecureZone — app.js
   Lógica completa: productos, carrito, auth, checkout, UI
   ⚠️ Los productos se cargan desde data-productos.js
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
   1. DATOS — PRODUCTOS (vacío inicialmente)
══════════════════════════════ */
let PRODUCTS = [];

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

/* ══════════════════════════════
   1.5 CARGAR PRODUCTOS DESDE ARCHIVO EXTERNO
══════════════════════════════ */
function cargarProductosExternos() {
  // Si ya hay productos, no recargar
  if (PRODUCTS.length > 0) return true;
  
  // Intentar cargar desde window (si data-productos.js ya se cargó)
  if (typeof window.PRODUCTOS_DATA !== 'undefined' && window.PRODUCTOS_DATA.length > 0) {
    PRODUCTS.push(...normalizeProductCatalog(window.PRODUCTOS_DATA));
    console.log('✅ Productos cargados desde data-productos.js:', PRODUCTS.length);
    return true;
  }
  
  console.warn('⚠️ No se encontraron productos en window.PRODUCTOS_DATA');
  return false;
}

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

/* ══════════════════════════════
   4. NAVEGACIÓN DE PÁGINAS
══════════════════════════════ */
const PARTIAL_PAGES = new Set(['products', 'about', 'contact']);
const loadedPartials = new Set();

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
            <p>No se pudo cargar esta sección.</p>
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
  const navLinks = document.getElementById('navLinks');
  if (navLinks) navLinks.classList.remove('open');

  // Acciones especiales por página
  if (pageId === 'products') {
    cargarProductosExternos();
    // 🔧 CORRECCIÓN: Primero reseteamos la vista a la lista de productos
    showProductsList();
    renderProducts();
  }
  if (pageId === 'checkout') renderCheckoutSummary();
}

/* ══════════════════════════════
   5. NAVBAR — MENÚ MÓVIL
══════════════════════════════ */
function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  if (navLinks) navLinks.classList.toggle('open');
}

/* ══════════════════════════════
   6. RENDERIZAR PRODUCTOS
══════════════════════════════ */
function getStarsHtml(stars) {
  return '★'.repeat(Math.round(stars)) + '☆'.repeat(5 - Math.round(stars));
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
  cargarProductosExternos();
  
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
      || (product.brand && product.brand.toLowerCase().includes(search))
      || (product.model && product.model.toLowerCase().includes(search))
      || (product.tvcKey && product.tvcKey.toLowerCase().includes(search))
      || (product.satKey && product.satKey.toLowerCase().includes(search))
      || (product.fullDescription && product.fullDescription.toLowerCase().includes(search))
      || (product.technicalDetails && product.technicalDetails.some(detail => detail.toLowerCase().includes(search)));
    return matchCat && matchSearch;
  });

  if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  if (sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));

  grid.innerHTML = '';
  if (filtered.length === 0) {
    if (noResults) noResults.style.display = 'block';
  } else {
    if (noResults) noResults.style.display = 'none';
    filtered.forEach(product => grid.appendChild(createProductCard(product)));
  }
}

function renderFeatured() {
  cargarProductosExternos();
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  grid.innerHTML = '';
  PRODUCTS
    .filter(product => product.featured)
    .slice(0, 4)
    .forEach(product => grid.appendChild(createProductCard(product)));
}

function toggleProductsView(view) {
  const listView = document.getElementById('productsListView');
  const detailView = document.getElementById('productDetailView');
  if (!listView || !detailView) return;

  listView.style.display = view === 'detail' ? 'none' : 'block';
  detailView.style.display = view === 'detail' ? 'block' : 'none';
}

function updateFilterTabs(activeCategory = 'Todos') {
  document.querySelectorAll('.filter-tab').forEach(tab => {
    const label = tab.textContent.trim();
    const isMatch = label === activeCategory || (activeCategory === 'NVR' && label === 'NVR/DVR');
    tab.classList.toggle('active', isMatch);
  });
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

function getProductById(id) {
  return PRODUCTS.find(product => product.id === Number(id));
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

/* ══════════════════════════════
   7. CARRITO
══════════════════════════════ */
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
  if (countEl) {
    countEl.textContent = count;
    countEl.style.display = count > 0 ? 'flex' : 'none';
  }

  renderCartItems();
  updateCartTotals();
}

function renderCartItems() {
  const container = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');

  if (!container) return;

  if (State.cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-bag-shopping"></i>
        <p>Tu carrito está vacío</p>
        <button class="btn-accent" onclick="showPage('products'); toggleCart()">Ver Productos</button>
      </div>`;
    if (footer) footer.style.display = 'none';
    return;
  }

  if (footer) footer.style.display = 'block';

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

  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartTotal = document.getElementById('cartTotal');
  if (cartSubtotal) cartSubtotal.textContent = `$${sub.toLocaleString()}`;
  if (cartTotal) cartTotal.textContent = `$${Math.round(total).toLocaleString()}`;
}

function toggleCart() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (!drawer || !overlay) return;
  const isOpen = drawer.classList.contains('open');
  drawer.classList.toggle('open');
  overlay.classList.toggle('open');
  document.body.style.overflow = isOpen ? '' : 'hidden';
}

function pulseCartBtn() {
  const btn = document.querySelector('.cart-btn');
  if (!btn) return;
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
   8. CHECKOUT
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

  const chkSubtotal = document.getElementById('chkSubtotal');
  const chkTotal = document.getElementById('chkTotal');
  if (chkSubtotal) chkSubtotal.textContent = `$${sub.toLocaleString()}`;
  if (chkTotal) chkTotal.textContent = `$${Math.round(total).toLocaleString()}`;

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
    const stepDiv = document.getElementById(`checkoutStep${n}`);
    if (stepDiv) stepDiv.style.display = n === step ? 'block' : 'none';
    const ind = document.getElementById(`step${n}indicator`);
    if (ind) {
      ind.classList.remove('active', 'done');
      if (n < step) ind.classList.add('done');
      else if (n === step) ind.classList.add('active');
    }
  });
}

function goToPayment() {
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
  if (!btn) return;
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
  const orderSpan = document.getElementById('orderNumber');
  if (orderSpan) orderSpan.textContent = orderNum;

  const sd = State.shippingData;
  const total = Math.round(getCartTotal()).toLocaleString();
  const confirmDetails = document.getElementById('confirmDetails');
  if (confirmDetails) {
    confirmDetails.innerHTML = `
      <strong>📦 Envío a:</strong><br>
      ${sd.nombre} ${sd.apellido}<br>
      ${sd.direccion}, ${sd.ciudad}, ${sd.estado} ${sd.cp}<br><br>
      <strong>📧 Confirmación enviada a:</strong> ${sd.email}<br>
      <strong>💳 Total cobrado:</strong> $${total} MXN<br>
      <strong>🚚 Tiempo de entrega:</strong> 2–4 días hábiles
    `;
  }

  // Limpiar carrito
  State.cart = [];
  saveCart();
  updateCartUI();

  goToStep(3);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  showToast('¡Pago procesado exitosamente! 🎉', 'success');
}

/* ══════════════════════════════
   9. TARJETA DE CRÉDITO VISUAL
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
   10. AUTENTICACIÓN
══════════════════════════════ */
function updateAuthUI() {
  const navUserArea = document.getElementById('navUserArea');
  const navLoggedArea = document.getElementById('navLoggedArea');
  const navUserName = document.getElementById('navUserName');

  if (!navUserArea || !navLoggedArea) return;

  if (State.user) {
    navUserArea.style.display = 'none';
    navLoggedArea.style.display = 'flex';
    if (navUserName) navUserName.textContent = State.user.nombre || State.user.email?.split('@')[0] || 'Usuario';
  } else {
    navUserArea.style.display = 'flex';
    navLoggedArea.style.display = 'none';
  }
}

function logout() {
  State.user = null;
  saveUser();
  updateAuthUI();
  showToast('Sesión cerrada correctamente', 'info');
  showPage('home');
}

async function handleRegister(e) {
  e.preventDefault();
  
  const userData = {
    nombre: document.getElementById('regNombre').value.trim(),
    apellido: document.getElementById('regApellido').value.trim(),
    email: document.getElementById('regEmail').value.trim().toLowerCase(),
    tel: document.getElementById('regTel').value.trim(),
    pass: document.getElementById('regPass').value,
    wantsPromo: document.getElementById('regPromo')?.checked || false
  };
  
  const pass2 = document.getElementById('regPass2').value;
  const errEl = document.getElementById('registerError');
  
  if (userData.pass.length < 8) {
    if (errEl) { errEl.querySelector('span').textContent = 'La contraseña debe tener al menos 8 caracteres.'; errEl.style.display = 'flex'; }
    return;
  }
  if (userData.pass !== pass2) {
    if (errEl) { errEl.querySelector('span').textContent = 'Las contraseñas no coinciden.'; errEl.style.display = 'flex'; }
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
      State.user = result.user;
      saveUser();
      updateAuthUI();
      
      const localUser = { ...result.user, pass: userData.pass };
      State.users.push(localUser);
      saveUsers();
      
      showToast(`¡Bienvenido/a ${result.user.nombre}! Tu cuenta fue creada exitosamente 🎉`, 'success');
      showPage('home');
    } else {
      if (errEl) { errEl.querySelector('span').textContent = result.message; errEl.style.display = 'flex'; }
    }
  } catch (error) {
    if (errEl) { errEl.querySelector('span').textContent = 'Error de conexión con el servidor'; errEl.style.display = 'flex'; }
  }
}

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
      
      const existingLocal = State.users.find(u => u.email === email);
      if (!existingLocal) {
        State.users.push({ ...result.user, pass: password });
        saveUsers();
      }
      
      updateAuthUI();
      showToast(`¡Hola de nuevo, ${result.user.nombre}! 👋`, 'success');
      showPage('home');
    } else {
      if (errEl) { errEl.querySelector('span').textContent = result.message; errEl.style.display = 'flex'; }
    }
  } catch (error) {
    if (errEl) { errEl.querySelector('span').textContent = 'Error de conexión con el servidor'; errEl.style.display = 'flex'; }
  }
}

function demoLogin() {
  const demoEmail = 'demo@securezone.mx';
  const demoPass = 'demo1234';
  document.getElementById('loginEmail').value = demoEmail;
  document.getElementById('loginPassword').value = demoPass;
  handleLogin(new Event('submit'));
}

/* ══════════════════════════════
   11. FUERZA DE CONTRASEÑA
══════════════════════════════ */
function checkStrength(val) {
  const fill = document.getElementById('strengthFill');
  const label = document.getElementById('strengthLabel');
  if (!fill || !label) return;

  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  const levels = [
    { pct: '25%', color: 'var(--error)', text: 'Muy débil' },
    { pct: '50%', color: 'var(--warning)', text: 'Débil' },
    { pct: '75%', color: 'var(--accent)', text: 'Buena' },
    { pct: '100%', color: 'var(--success)', text: 'Excelente' },
  ];

  const lvl = levels[Math.max(0, score - 1)];
  if (val.length === 0) {
    fill.style.width = '0';
    label.textContent = '';
  } else {
    fill.style.width = lvl.pct;
    fill.style.background = lvl.color;
    label.textContent = lvl.text;
    label.style.color = lvl.color;
  }
}

/* ══════════════════════════════
   12. TOGGLE CONTRASEÑA
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
   13. CONTACTO
══════════════════════════════ */
function handleContact(e) {
  e.preventDefault();
  showToast('Mensaje enviado correctamente. Te contactaremos pronto 📬', 'success');
  e.target.reset();
}

/* ══════════════════════════════
   14. TOAST NOTIFICATIONS
══════════════════════════════ */
function showToast(message, type = 'info') {
  const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info' };
  const container = document.getElementById('toastContainer');
  if (!container) return;
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
   15. SCROLL NAVBAR
══════════════════════════════ */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) {
    if (window.scrollY > 30) {
      nav.style.boxShadow = '0 4px 30px rgba(0,0,0,.5)';
    } else {
      nav.style.boxShadow = 'none';
    }
  }
});

/* ══════════════════════════════
   16. CERRAR CARRITO CON ESC
══════════════════════════════ */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (State.currentPage === 'products' && State.currentProductId) {
      showProductsList();
    } else if (document.getElementById('productModal')?.classList.contains('open')) {
      closeProductModal();
    } else if (document.getElementById('cartDrawer')?.classList.contains('open')) {
      toggleCart();
    }
  }
});

/* ══════════════════════════════
   17. INICIALIZACIÓN
══════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  // Cargar productos desde el archivo externo
  cargarProductosExternos();
  
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
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 5500);
  }

  document.addEventListener('DOMContentLoaded', function() {
    resetTimer();
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