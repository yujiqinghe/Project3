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

function renderCart() {
  const cart = getCart();
  const container = document.getElementById('cart-items');
  const subtotalEl = document.getElementById('subtotal-value');
  const totalEl = document.getElementById('total-value');

  if (!container) return;

  // Clear previous content
  container.innerHTML = '';

  // Empty cart state
  if (cart.length === 0) {
    container.innerHTML =
      '<div class="empty-cart">' +
        'Your cart is empty<br>' +
        '<a href="../home/index.html" class="empty-cart-link">Continue Shopping</a>' +
      '</div>';
    if (subtotalEl) subtotalEl.textContent = formatPrice(0);
    if (totalEl) totalEl.textContent = formatPrice(0);
    return;
  }

  // Render each cart item
  let subtotal = 0;

  cart.forEach(function(item) {
    const lineTotal = item.price * item.quantity;
    subtotal += lineTotal;

    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.setAttribute('data-id', item.id);
    itemEl.innerHTML =
      '<img src="' + item.image + '" alt="' + item.name + '" class="cart-item-img" onerror="this.src=\'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><text y=%2230%22 font-size=%2224%22>🐟</text></svg>\'">' +
      '<div class="cart-item-info">' +
        '<div class="cart-item-row1">' +
          '<span class="cart-item-name">' + item.name + '</span>' +
          '<span class="cart-item-price">' + formatPrice(lineTotal) + '</span>' +
        '</div>' +
        '<div class="cart-item-row2">' +
          '<span class="cart-item-unit">' + formatPrice(item.price) + ' each</span>' +
          '<div class="cart-qty-stepper">' +
            '<button class="cart-qty-btn" data-action="dec">−</button>' +
            '<span class="cart-qty-count">' + item.quantity + '</span>' +
            '<button class="cart-qty-btn" data-action="inc">+</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<button class="remove-btn" data-action="remove">×</button>';
    container.appendChild(itemEl);
  });

  // Update subtotal and total in realtime
  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (totalEl) totalEl.textContent = formatPrice(subtotal + DELIVERY_FEE);
}

function updateQuantity(id, delta) {
  const cart = getCart();
  const item = cart.find(function(i) { return i.id === id; });
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    const filtered = cart.filter(function(i) { return i.id !== id; });
    saveCart(filtered);
  } else {
    saveCart(cart);
  }
  renderCart();
}

function removeItem(id) {
  const cart = getCart().filter(function(i) { return i.id !== id; });
  saveCart(cart);
  renderCart();
}

document.addEventListener('DOMContentLoaded', function() {
  // Render the cart on page load
  renderCart();

  // Delegate click events for qty buttons and remove buttons
  var container = document.getElementById('cart-items');
  if (container) {
    container.addEventListener('click', function(e) {
      var btn = e.target.closest('button');
      if (!btn) return;

      var cartItem = btn.closest('.cart-item');
      if (!cartItem) return;

      var id = cartItem.getAttribute('data-id');
      if (!id) return;

      var action = btn.getAttribute('data-action');
      if (!action) return;

      if (action === 'inc') {
        updateQuantity(id, 1);
      } else if (action === 'dec') {
        updateQuantity(id, -1);
      } else if (action === 'remove') {
        removeItem(id);
      }
    });
  }

  // Proceed To Checkout button → go to confirmation page
  var checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      var cart = getCart();
      if (cart.length === 0) {
        alert('Your cart is empty! Add some items first.');
        return;
      }
      window.location.href = '../comfirmation/index.html';
    });
  }
});
