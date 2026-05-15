const CART_KEY = 'kfl_cart';
const DELIVERY_FEE = 2;

function getCart() {
  try {
    var data = localStorage.getItem(CART_KEY);
    if (!data) return [];
    var parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function formatPrice(price) {
  var num = Number(price) || 0;
  return '$' + num.toFixed(2);
}

document.addEventListener('DOMContentLoaded', function() {
  if (window.matchMedia('(min-width: 1024px)').matches) {
    window.location.replace('../cart/index.html');
    return;
  }

  var cart = getCart();
  var subtotal = 0;
  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    subtotal += (Number(item.price) || 0) * (Number(item.quantity) || 0);
  }
  var total = subtotal + DELIVERY_FEE;

  var subtotalEl = document.getElementById('summary-subtotal-mobile');
  var deliveryEl = document.getElementById('summary-delivery-mobile');
  var totalEl = document.getElementById('summary-total-mobile');

  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (deliveryEl) deliveryEl.textContent = formatPrice(DELIVERY_FEE);
  if (totalEl) totalEl.textContent = formatPrice(total);

  var checkoutBtn = document.getElementById('checkout-btn-mobile');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      if (cart.length === 0) {
        alert('Your cart is empty! Please add items before checking out.');
        return;
      }
      try {
        sessionStorage.setItem('kfl_last_order_total', formatPrice(total));
      } catch (e) { /* ignore */ }
      localStorage.removeItem(CART_KEY);
      window.location.href = '../Final/index.html';
    });
  }
});
