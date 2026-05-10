const CART_KEY = 'kfl_cart';

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function getCartItemQty(id) {
  const item = getCart().find(i => i.id === id);
  return item ? item.quantity : 0;
}

function adjustImagePath(path) {
  if (path && !path.startsWith('../') && !path.startsWith('http')) {
    return '../home/' + path;
  }
  return path;
}

function addToCart(product) {
  product.image = adjustImagePath(product.image);
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
  updateCartBadge();
}

function removeFromCart(id) {
  const cart = getCart().filter(item => item.id !== id);
  saveCart(cart);
  updateCartBadge();
}

function updateQuantity(id, quantity) {
  const cart = getCart();
  const item = cart.find(item => item.id === id);
  if (item) {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    item.quantity = quantity;
    saveCart(cart);
    updateCartBadge();
  }
}

function updateCartBadge() {
  const count = getCartCount();
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
}

function syncAllButtons() {
  document.querySelectorAll('.product-card').forEach(card => {
    syncButton(card);
  });
}

function syncButton(card) {
  const id = card.dataset.id;
  if (!id) return;

  const addBtn = card.querySelector('.add-btn');
  const qty = getCartItemQty(id);

  if (qty > 0) {
    addBtn.style.display = 'none';

    let stepper = card.querySelector('.qty-stepper');
    if (!stepper) {
      stepper = document.createElement('div');
      stepper.className = 'qty-stepper active';
      stepper.innerHTML =
        '<button class="qty-stepper-btn" data-action="dec">−</button>' +
        '<span class="qty-stepper-count">' + qty + '</span>' +
        '<button class="qty-stepper-btn" data-action="inc">+</button>';
      card.appendChild(stepper);
    } else {
      stepper.classList.add('active');
      stepper.style.display = 'flex';
      stepper.querySelector('.qty-stepper-count').textContent = qty;
    }
  } else {
    addBtn.style.display = 'flex';

    const stepper = card.querySelector('.qty-stepper');
    if (stepper) {
      stepper.classList.remove('active');
      stepper.style.display = 'none';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  syncAllButtons();

  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      if (!card) return;
      const product = {
        id: card.dataset.id,
        name: card.dataset.name,
        price: parseFloat(card.dataset.price),
        image: card.dataset.image
      };
      addToCart(product);
      syncButton(card);
    });
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.qty-stepper-btn');
    if (!btn) return;

    const card = btn.closest('.product-card');
    if (!card) return;

    const id = card.dataset.id;
    const action = btn.dataset.action;

    if (action === 'inc') {
      const product = {
        id: card.dataset.id,
        name: card.dataset.name,
        price: parseFloat(card.dataset.price),
        image: card.dataset.image
      };
      addToCart(product);
    } else if (action === 'dec') {
      const qty = getCartItemQty(id);
      if (qty <= 1) {
        removeFromCart(id);
      } else {
        updateQuantity(id, qty - 1);
      }
    }

    syncButton(card);
  });

  // Hero Slider (same auto-rotate + dot clicks on mobile and desktop)
  const heroBanners = document.querySelectorAll('.hero-banner');
  const heroDots = document.querySelectorAll('#section-hero .dot');

  if (heroBanners.length && heroDots.length) {
    let currentHero = 0;
    let heroInterval = null;

    function clearHeroInterval() {
      if (heroInterval) {
        clearInterval(heroInterval);
        heroInterval = null;
      }
    }

    function showHeroSlide(index) {
      currentHero = ((index % heroBanners.length) + heroBanners.length) % heroBanners.length;
      heroBanners.forEach((b, i) => b.classList.toggle('active', i === currentHero));
      heroDots.forEach((d, i) => {
        if (i >= heroBanners.length) return;
        d.classList.toggle('active', i === currentHero);
      });
    }

    function nextHeroSlide() {
      showHeroSlide(currentHero + 1);
    }

    function startHeroSlider() {
      clearHeroInterval();
      heroInterval = setInterval(nextHeroSlide, 4000);
    }

    heroDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        if (i >= heroBanners.length) return;
        showHeroSlide(i);
        clearHeroInterval();
        heroInterval = setInterval(nextHeroSlide, 4000);
      });
    });

    showHeroSlide(0);
    startHeroSlider();
  }

  // Sidebar toggle
  const menuBtn = document.getElementById('menu-btn');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const sidebarPanel = document.getElementById('sidebar-panel');
  const sidebarClose = document.getElementById('sidebar-close');

  function openSidebar() {
    sidebarOverlay.classList.add('active');
    sidebarPanel.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebarOverlay.classList.remove('active');
    sidebarPanel.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuBtn) menuBtn.addEventListener('click', openSidebar);
  if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);
});
