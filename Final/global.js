document.addEventListener('DOMContentLoaded', function() {
  var orderNumberEl = document.getElementById('order-number');
  if (orderNumberEl) {
    var now = new Date();
    var suffix = String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
    orderNumberEl.textContent = '#ORD-' + now.getFullYear() + '-' + suffix;
  }

  var totalEl = document.getElementById('order-total');
  if (totalEl) {
    try {
      var stored = sessionStorage.getItem('kfl_last_order_total');
      if (stored) {
        totalEl.textContent = stored;
      }
    } catch (e) {
      /* ignore */
    }
  }
});
