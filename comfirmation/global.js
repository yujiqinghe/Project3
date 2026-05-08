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
  var cart = getCart();

  // Calculate subtotal from all cart items
  var subtotal = 0;
  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    var price = Number(item.price) || 0;
    var qty = Number(item.quantity) || 0;
    subtotal += price * qty;
  }
  var total = subtotal + DELIVERY_FEE;

  // Update DOM elements
  var subtotalEl = document.getElementById('summary-subtotal');
  var deliveryEl = document.getElementById('summary-delivery');
  var totalEl = document.getElementById('summary-total');

  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (deliveryEl) deliveryEl.textContent = formatPrice(DELIVERY_FEE);
  if (totalEl) totalEl.textContent = formatPrice(total);

  // Check Out button: clear cart and go to Final page
  var checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      if (cart.length === 0) {
        alert('Your cart is empty! Please add items before checking out.');
        return;
      }
      // Clear the cart
      localStorage.removeItem(CART_KEY);
      // Navigate to order success page
      window.location.href = '../Final/index.html';
    });
  }
});
