(() => {
  const header = document.getElementById('header');
  if (header) {
    const onScroll = () => { if (window.scrollY > 30) header.classList.add('scrolled'); else header.classList.remove('scrolled'); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      const icon = menuToggle.querySelector('i');
      icon.className = nav.classList.contains('open') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.querySelector('i').className = 'fa-solid fa-bars';
    }));
  }
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    reveals.forEach(r => obs.observe(r));
  } else { reveals.forEach(r => r.classList.add('visible')); }
  const featuredTrack = document.getElementById('featuredTrack');
  if (featuredTrack && typeof PRODUCTS !== 'undefined') {
    const featured = PRODUCTS.filter(p => p.featured);
    featuredTrack.innerHTML = featured.map(productCardHTML).join('');
    bindProductCards(featuredTrack);
    const carousel = document.getElementById('featuredCarousel');
    const prevBtn = carousel.querySelector('.prev');
    const nextBtn = carousel.querySelector('.next');
    const scrollAmount = () => featuredTrack.clientWidth * 0.7;
    prevBtn.addEventListener('click', () => featuredTrack.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
    nextBtn.addEventListener('click', () => featuredTrack.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
  }
})();
function productCardHTML(p) {
  const badge = p.badge ? `<span class="badge product-tag">${p.badge}</span>` : '';
  return `<article class="product-card" data-id="${p.id}">
    <a href="product.html?id=${p.id}" class="product-card-image" style="--bg-img: url('${p.image}')" aria-label="${p.name}">
      ${badge}
      <button class="product-fav" aria-label="Favorito" onclick="event.preventDefault(); event.stopPropagation(); this.querySelector('i').classList.toggle('fa-solid'); this.querySelector('i').classList.toggle('fa-regular');">
        <i class="fa-regular fa-heart"></i>
      </button>
    </a>
    <div class="product-card-body">
      <span class="product-cat">${labelCategory(p.category)}</span>
      <a href="product.html?id=${p.id}" class="product-name">${p.name}</a>
      <span class="product-notes">${p.notes}</span>
      <div class="product-card-foot">
        <span class="price">${formatMoney(p.price)}</span>
        <button class="add-cart" data-add="${p.id}" aria-label="Añadir al carrito"><i class="fa-solid fa-plus"></i></button>
      </div>
    </div>
  </article>`;
}
function labelCategory(c) {
  return ({ grano: 'Café en grano', molido: 'Café molido', capsulas: 'Cápsulas', accesorios: 'Accesorios' })[c] || c;
}
function bindProductCards(scope) {
  scope.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      Cart.add(btn.dataset.add, 1);
      btn.innerHTML = '<i class="fa-solid fa-check"></i>';
      setTimeout(() => { btn.innerHTML = '<i class="fa-solid fa-plus"></i>'; }, 1200);
    });
  });
}
