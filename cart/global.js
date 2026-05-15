const CART_KEY = 'kfl_cart';
const DELIVERY_FEE = 2;

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

function formatPrice(price) {
  return '$' + price.toFixed(2);
}

function buildMobileItemHtml(item) {
  const lineTotal = item.price * item.quantity;
  return (
    '<div class="cart-item" data-id="' + item.id + '">' +
      '<img src="' + item.image + '" alt="' + item.name + '" class="cart-item-img">' +
      '<div class="cart-item-info">' +
        '<div class="cart-item-row1">' +
          '<span class="cart-item-name">' + item.name + '</span>' +
          '<span class="cart-item-price">' + formatPrice(lineTotal) + '</span>' +
        '</div>' +
        '<div class="cart-item-row2">' +
          '<span class="cart-item-unit">' + formatPrice(item.price) + ' each</span>' +
          '<div class="cart-qty-stepper">' +
            '<button type="button" class="cart-qty-btn" data-action="dec">−</button>' +
            '<span class="cart-qty-count">' + item.quantity + '</span>' +
            '<button type="button" class="cart-qty-btn" data-action="inc">+</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<button type="button" class="remove-btn" data-action="remove" aria-label="Remove">×</button>' +
    '</div>'
  );
}

function buildDesktopItemHtml(item) {
  return (
    '<article class="purchase-desktop-item" data-id="' + item.id + '">' +
      '<div class="purchase-desktop-item-thumb">' +
        '<img src="' + item.image + '" alt="' + item.name + '">' +
      '</div>' +
      '<div class="purchase-desktop-item-details">' +
        '<h3 class="purchase-desktop-item-name">' + item.name + '</h3>' +
        '<p class="purchase-desktop-item-price">' + formatPrice(item.price) + '</p>' +
      '</div>' +
      '<div class="purchase-desktop-item-qty">' +
        '<button type="button" class="purchase-desktop-qty-btn" data-action="dec" aria-label="Decrease">−</button>' +
        '<span class="purchase-desktop-qty-count">' + item.quantity + '</span>' +
        '<button type="button" class="purchase-desktop-qty-btn" data-action="inc" aria-label="Increase">+</button>' +
      '</div>' +
      '<button type="button" class="purchase-desktop-remove" data-action="remove" aria-label="Remove">' +
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>' +
      '</button>' +
    '</article>'
  );
}

function updateSummaryElements(subtotal) {
  const total = subtotal + DELIVERY_FEE;
  const formattedSub = formatPrice(subtotal);
  const formattedTotal = formatPrice(total);

  ['subtotal-value-mobile', 'subtotal-value-desktop'].forEach(function(id) {
    const el = document.getElementById(id);
    if (el) el.textContent = formattedSub;
  });
  ['total-value-mobile', 'total-value-desktop'].forEach(function(id) {
    const el = document.getElementById(id);
    if (el) el.textContent = formattedTotal;
  });
}

function renderCart() {
  const cart = getCart();
  const mobileContainer = document.getElementById('cart-items-mobile');
  const desktopContainer = document.getElementById('cart-items-desktop');

  const emptyHtml =
    '<div class="empty-cart">' +
      'Your cart is empty<br>' +
      '<a href="../home/index.html" class="empty-cart-link">Continue Shopping</a>' +
    '</div>';

  if (cart.length === 0) {
    if (mobileContainer) mobileContainer.innerHTML = emptyHtml;
    if (desktopContainer) desktopContainer.innerHTML = emptyHtml;
    updateSummaryElements(0);
    return;
  }

  let subtotal = 0;
  let mobileHtml = '';
  let desktopHtml = '';

  cart.forEach(function(item) {
    subtotal += item.price * item.quantity;
    mobileHtml += buildMobileItemHtml(item);
    desktopHtml += buildDesktopItemHtml(item);
  });

  if (mobileContainer) mobileContainer.innerHTML = mobileHtml;
  if (desktopContainer) desktopContainer.innerHTML = desktopHtml;
  updateSummaryElements(subtotal);
}

function updateQuantity(id, delta) {
  const cart = getCart();
  const item = cart.find(function(i) { return i.id === id; });
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    saveCart(cart.filter(function(i) { return i.id !== id; }));
  } else {
    saveCart(cart);
  }
  renderCart();
}

function removeItem(id) {
  saveCart(getCart().filter(function(i) { return i.id !== id; }));
  renderCart();
}

function handleCartClick(e) {
  const btn = e.target.closest('button');
  if (!btn) return;

  const cartItem = btn.closest('[data-id]');
  if (!cartItem) return;

  const id = cartItem.getAttribute('data-id');
  const action = btn.getAttribute('data-action');
  if (!id || !action) return;

  if (action === 'inc') updateQuantity(id, 1);
  else if (action === 'dec') updateQuantity(id, -1);
  else if (action === 'remove') removeItem(id);
}

function goToCheckoutMobile() {
  const cart = getCart();
  if (cart.length === 0) {
    alert('Your cart is empty! Add some items first.');
    return;
  }
  window.location.href = '../comfirmation/index.html';
}

function completePurchaseDesktop() {
  const cart = getCart();
  if (cart.length === 0) {
    alert('Your cart is empty! Add some items first.');
    return;
  }
  let subtotal = 0;
  cart.forEach(function(item) {
    subtotal += item.price * item.quantity;
  });
  try {
    sessionStorage.setItem('kfl_last_order_total', formatPrice(subtotal + DELIVERY_FEE));
  } catch (e) { /* ignore */ }
  localStorage.removeItem(CART_KEY);
  window.location.href = '../Final/index.html';
}

document.addEventListener('DOMContentLoaded', function() {
  renderCart();

  const mobileContainer = document.getElementById('cart-items-mobile');
  const desktopContainer = document.getElementById('cart-items-desktop');

  if (mobileContainer) mobileContainer.addEventListener('click', handleCartClick);
  if (desktopContainer) desktopContainer.addEventListener('click', handleCartClick);

  const checkoutMobile = document.getElementById('checkout-btn-mobile');
  const checkoutDesktop = document.getElementById('checkout-btn-desktop');

  if (checkoutMobile) checkoutMobile.addEventListener('click', goToCheckoutMobile);
  if (checkoutDesktop) checkoutDesktop.addEventListener('click', completePurchaseDesktop);
});
