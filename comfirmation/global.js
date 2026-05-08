const DELIVERY_FEE = 2;

function getCart() {
  try {
    return JSON.parse(localStorage.getItem('kfl_cart')) || [];
  } catch {
    return [];
  }
}

function formatPrice(price) {
  return '$' + price.toFixed(2);
}

document.addEventListener('DOMContentLoaded', () => {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + DELIVERY_FEE;

  const subtotalEl = document.getElementById('summary-subtotal');
  const deliveryEl = document.getElementById('summary-delivery');
  const totalEl = document.getElementById('summary-total');

  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (deliveryEl) deliveryEl.textContent = formatPrice(DELIVERY_FEE);
  if (totalEl) totalEl.textContent = formatPrice(total);

  const checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
      }
      localStorage.removeItem('kfl_cart');
      window.location.href = '../Final/index.html';
    });
  }
});
