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

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += product.quantity || 1;
  } else {
    cart.push({ ...product, quantity: product.quantity || 1 });
  }
  saveCart(cart);
  updateCartBadge();
}

function updateCartBadge() {
  const count = getCartCount();
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();

  const addBtn = document.querySelector('.btn-add-cart');
  const productSection = document.getElementById('section-product');
  if (addBtn && productSection) {
    addBtn.addEventListener('click', () => {
      let imagePath = productSection.dataset.image;
      if (imagePath && !imagePath.startsWith('../')) {
        imagePath = '../productinfo/' + imagePath;
      }
      const product = {
        id: productSection.dataset.id,
        name: productSection.dataset.name,
        price: parseFloat(productSection.dataset.price),
        image: imagePath
      };
      addToCart(product);
      addBtn.textContent = 'Added!';
      setTimeout(() => addBtn.textContent = 'Add to cart', 1200);
    });
  }
});