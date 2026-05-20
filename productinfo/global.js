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

function getCartItemQty(id) {
  const item = getCart().find(i => i.id === id);
  return item ? item.quantity : 0;
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

function syncActionButtons() {
  const productSection = document.getElementById('section-product');
  if (!productSection) return;
  const id = productSection.dataset.id;
  const qty = getCartItemQty(id);

  document.querySelectorAll('.action-container').forEach(container => {
    const addBtn = container.querySelector('.add-btn-main');
    
    if (qty > 0) {
      if (addBtn) addBtn.style.display = 'none';

      let stepper = container.querySelector('.qty-stepper');
      if (!stepper) {
        stepper = document.createElement('div');
        stepper.className = 'qty-stepper active';
        stepper.innerHTML = `
          <button class="qty-stepper-btn" data-action="dec">−</button>
          <span class="qty-stepper-count">${qty}</span>
          <button class="qty-stepper-btn" data-action="inc">+</button>
        `;
        container.appendChild(stepper);
      } else {
        stepper.classList.add('active');
        stepper.style.display = 'flex';
        stepper.querySelector('.qty-stepper-count').textContent = qty;
      }
    } else {
      if (addBtn) {
        addBtn.style.display = 'flex';
        addBtn.textContent = 'Add to cart';
      }
      const stepper = container.querySelector('.qty-stepper');
      if (stepper) {
        stepper.classList.remove('active');
        stepper.style.display = 'none';
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  syncActionButtons();

  const productSection = document.getElementById('section-product');

  document.addEventListener('click', (e) => {
    // Add to cart buttons
    const addBtn = e.target.closest('.add-btn-main');
    if (addBtn && productSection) {
      let imagePath = productSection.dataset.image;
      if (imagePath && !imagePath.startsWith('../')) {
        imagePath = '../productinfo/' + imagePath;
      }
      const product = {
        id: productSection.dataset.id,
        name: productSection.dataset.name,
        price: parseFloat(productSection.dataset.price),
        image: imagePath,
        quantity: 1
      };
      addToCart(product);
      syncActionButtons();
      return;
    }

    // Stepper buttons
    const stepperBtn = e.target.closest('.qty-stepper-btn');
    if (stepperBtn && productSection) {
      const id = productSection.dataset.id;
      const action = stepperBtn.dataset.action;

      if (action === 'inc') {
        let imagePath = productSection.dataset.image;
        if (imagePath && !imagePath.startsWith('../')) {
          imagePath = '../productinfo/' + imagePath;
        }
        const product = {
          id: id,
          name: productSection.dataset.name,
          price: parseFloat(productSection.dataset.price),
          image: imagePath,
          quantity: 1
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
      syncActionButtons();
    }
  });
});
