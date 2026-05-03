const CART_KEY = 'cdc_cart_v1';
const Cart = {
  get() { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(CART_KEY, JSON.stringify(items)); this.updateBadge(); document.dispatchEvent(new CustomEvent('cart:change')); },
  add(productId, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === productId);
    if (existing) existing.qty += qty; else items.push({ id: productId, qty });
    this.save(items);
    showToast('Producto añadido al carrito');
  },
  update(productId, qty) {
    let items = this.get();
    if (qty <= 0) items = items.filter(i => i.id !== productId);
    else items = items.map(i => i.id === productId ? { ...i, qty } : i);
    this.save(items);
  },
  remove(productId) { this.save(this.get().filter(i => i.id !== productId)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((acc, i) => acc + i.qty, 0); },
  subtotal() { return this.get().reduce((acc, i) => { const p = findProduct(i.id); return p ? acc + p.price * i.qty : acc; }, 0); },
  shipping() { const sub = this.subtotal(); if (sub === 0) return 0; return sub >= 80 ? 0 : 8; },
  total() { return this.subtotal() + this.shipping(); },
  updateBadge() {
    const badges = document.querySelectorAll('#cartCount');
    const c = this.count();
    badges.forEach(b => { b.textContent = c; b.style.display = c > 0 ? 'flex' : 'none'; });
  }
};
function showToast(message) {
  let toast = document.getElementById('cdcToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cdcToast';
    toast.className = 'toast';
    toast.innerHTML = '<i class="fa-solid fa-circle-check"></i><span></span>';
    document.body.appendChild(toast);
  }
  toast.querySelector('span').textContent = message;
  toast.classList.add('active');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('active'), 2600);
}
document.addEventListener('DOMContentLoaded', () => Cart.updateBadge());
