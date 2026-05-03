(() => {
  const container = document.getElementById('cartContainer');
  if (!container) return;
  function render() {
    const items = Cart.get();
    if (!items.length) {
      container.innerHTML = `<div class="empty-cart"><i class="fa-solid fa-bag-shopping"></i><h2>Tu carrito está <span class="italic gold">vacío</span></h2><p>Descubre nuestra selección de cafés premium y empieza tu viaje sensorial.</p><a href="shop.html" class="btn btn-primary">Ir a la tienda <i class="fa-solid fa-arrow-right"></i></a></div>`;
      return;
    }
    const itemsHTML = items.map(i => {
      const p = findProduct(i.id);
      if (!p) return '';
      return `<div class="cart-item" data-id="${p.id}">
        <a href="product.html?id=${p.id}" class="cart-item-img" style="background-image:url('${p.image}')"></a>
        <div class="cart-item-info">
          <h4><a href="product.html?id=${p.id}">${p.name}</a></h4>
          <span>${labelCategory(p.category)} · ${p.notes}</span>
          <span class="price">${formatMoney(p.price)}</span>
        </div>
        <div class="cart-item-actions">
          <div class="qty-control">
            <button data-dec="${p.id}"><i class="fa-solid fa-minus"></i></button>
            <input type="number" min="1" value="${i.qty}" data-qty="${p.id}" />
            <button data-inc="${p.id}"><i class="fa-solid fa-plus"></i></button>
          </div>
          <button class="remove-btn" data-remove="${p.id}"><i class="fa-solid fa-trash"></i> Eliminar</button>
        </div>
      </div>`;
    }).join('');
    const sub = Cart.subtotal();
    const ship = Cart.shipping();
    const total = Cart.total();
    const remaining = Math.max(0, 80 - sub).toFixed(2);
    container.innerHTML = `
      <div class="cart-items">${itemsHTML}</div>
      <aside class="summary">
        <h3>Resumen</h3>
        <div class="summary-row"><span>Subtotal</span><span>${formatMoney(sub)}</span></div>
        <div class="summary-row"><span>Envío</span><span>${ship === 0 ? 'Gratis' : formatMoney(ship)}</span></div>
        ${ship > 0 ? `<div class="summary-row" style="font-size:12px; color:var(--gold);"><span><i class="fa-solid fa-circle-info"></i> Te faltan ${formatMoney(+remaining)} para envío gratis</span></div>` : ''}
        <div class="summary-row total"><span>Total</span><span>${formatMoney(total)}</span></div>
        <button class="btn btn-primary" id="checkoutBtn"><i class="fa-solid fa-lock"></i> Proceder al pago</button>
        <p style="text-align:center; font-size:12px; color:var(--muted); margin-top:14px;">Pago seguro · Cifrado SSL</p>
      </aside>`;
    container.querySelectorAll('[data-inc]').forEach(b => b.addEventListener('click', () => { const id = b.dataset.inc; const cur = Cart.get().find(x => x.id === id); Cart.update(id, (cur?.qty || 0) + 1); }));
    container.querySelectorAll('[data-dec]').forEach(b => b.addEventListener('click', () => { const id = b.dataset.dec; const cur = Cart.get().find(x => x.id === id); Cart.update(id, (cur?.qty || 1) - 1); }));
    container.querySelectorAll('[data-qty]').forEach(input => input.addEventListener('change', () => { const id = input.dataset.qty; const v = Math.max(1, +input.value || 1); Cart.update(id, v); }));
    container.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => { Cart.remove(b.dataset.remove); }));
    document.getElementById('checkoutBtn').addEventListener('click', openCheckout);
  }
  function openCheckout() {
    const modal = document.getElementById('checkoutModal');
    const body = document.getElementById('modalBody');
    body.innerHTML = `
      <form class="checkout-form" id="checkoutForm">
        <h2>Finalizar <span class="italic gold">compra</span></h2>
        <p>Total: <strong style="color:var(--gold)">${formatMoney(Cart.total())}</strong> · Esta es una simulación de pago.</p>
        <div class="form-row">
          <div class="form-field"><label>Nombre</label><input required placeholder="Juan" /></div>
          <div class="form-field"><label>Apellido</label><input required placeholder="Pérez" /></div>
        </div>
        <div class="form-field"><label>Email</label><input type="email" required placeholder="tu@correo.com" /></div>
        <div class="form-field"><label>Dirección</label><input required placeholder="Calle, número, ciudad" /></div>
        <div class="form-field"><label>Tarjeta</label><input required placeholder="4242 4242 4242 4242" /></div>
        <div class="form-row">
          <div class="form-field"><label>Vencimiento</label><input required placeholder="MM/AA" /></div>
          <div class="form-field"><label>CVV</label><input required placeholder="123" /></div>
        </div>
        <button type="submit" class="btn btn-primary"><i class="fa-solid fa-lock"></i> Pagar ${formatMoney(Cart.total())}</button>
      </form>`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('checkoutForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button[type="submit"]');
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Procesando...';
      btn.disabled = true;
      setTimeout(() => {
        body.innerHTML = `<div class="checkout-success"><div class="icon-success"><i class="fa-solid fa-check"></i></div><h2>¡Pedido confirmado!</h2><p>Hemos enviado los detalles de tu pedido a tu email. Pronto recibirás tu café fresco.</p><a href="index.html" class="btn btn-primary">Volver al inicio <i class="fa-solid fa-arrow-right"></i></a></div>`;
        Cart.clear();
      }, 1600);
    });
  }
  const modal = document.getElementById('checkoutModal');
  if (modal) {
    const close = () => { modal.classList.remove('active'); document.body.style.overflow = ''; render(); };
    document.getElementById('modalClose').addEventListener('click', close);
    modal.querySelector('.modal-backdrop').addEventListener('click', close);
  }
  document.addEventListener('cart:change', render);
  render();
})();
