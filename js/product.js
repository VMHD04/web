(() => {
  const wrap = document.getElementById('productDetail');
  if (!wrap) return;
  const params = new URLSearchParams(location.search);
  const id = params.get('id') || PRODUCTS[0].id;
  const product = findProduct(id) || PRODUCTS[0];
  document.title = `${product.name} — C. Club del Café`;
  const bcName = document.getElementById('bcName');
  if (bcName) bcName.textContent = product.name;
  const gallery = product.gallery && product.gallery.length ? product.gallery : [product.image];
  wrap.innerHTML = `
    <div>
      <div class="gallery-main" id="galleryMain" style="background-image: url('${gallery[0]}')"></div>
      <div class="gallery-thumbs" id="galleryThumbs">
        ${gallery.map((g, i) => `<button class="${i===0?'active':''}" data-img="${g}" style="background-image:url('${g}')" aria-label="Imagen ${i+1}"></button>`).join('')}
      </div>
    </div>
    <div class="product-info">
      <span class="eyebrow"><span class="dash"></span> ${labelCategory(product.category)}</span>
      <h1>${product.name}</h1>
      <div class="stars"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i> <span style="color:var(--muted); margin-left:8px;">(124 reseñas)</span></div>
      <div class="product-price-detail">${formatMoney(product.price)}</div>
      <p>${product.description}</p>
      <div class="qty-row">
        <label>Cantidad</label>
        <div class="qty-control">
          <button id="qtyMinus"><i class="fa-solid fa-minus"></i></button>
          <input type="number" id="qty" value="1" min="1" max="99" />
          <button id="qtyPlus"><i class="fa-solid fa-plus"></i></button>
        </div>
      </div>
      <div class="buy-row">
        <button class="btn btn-primary" id="addToCart"><i class="fa-solid fa-bag-shopping"></i> Añadir al carrito</button>
        <button class="icon-btn-large" id="favBtn"><i class="fa-regular fa-heart"></i></button>
        <button class="icon-btn-large"><i class="fa-solid fa-share-nodes"></i></button>
      </div>
      <div class="product-divider"></div>
      <div class="product-meta">
        <div class="meta-item"><i class="fa-solid fa-mountain"></i><div><strong>${product.origin}</strong><span>Origen</span></div></div>
        <div class="meta-item"><i class="fa-solid fa-arrow-up"></i><div><strong>${product.altitude}</strong><span>Altitud</span></div></div>
        <div class="meta-item"><i class="fa-solid fa-droplet"></i><div><strong>${product.process}</strong><span>Proceso</span></div></div>
        <div class="meta-item"><i class="fa-solid fa-fire"></i><div><strong>${product.roast}</strong><span>Tueste</span></div></div>
      </div>
      <div class="product-divider"></div>
      <div style="display:flex; gap:24px; flex-wrap:wrap; color:var(--text-soft); font-size:14px;">
        <span><i class="fa-solid fa-truck-fast" style="color:var(--gold); margin-right:8px;"></i> Envío en 24-48h</span>
        <span><i class="fa-solid fa-rotate-left" style="color:var(--gold); margin-right:8px;"></i> Devolución 30 días</span>
        <span><i class="fa-solid fa-leaf" style="color:var(--gold); margin-right:8px;"></i> 100% sostenible</span>
      </div>
    </div>`;
  const main = document.getElementById('galleryMain');
  document.querySelectorAll('#galleryThumbs button').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('#galleryThumbs button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      main.style.backgroundImage = `url('${b.dataset.img}')`;
    });
  });
  const qtyInput = document.getElementById('qty');
  document.getElementById('qtyMinus').addEventListener('click', () => { qtyInput.value = Math.max(1, (+qtyInput.value || 1) - 1); });
  document.getElementById('qtyPlus').addEventListener('click', () => { qtyInput.value = Math.min(99, (+qtyInput.value || 1) + 1); });
  document.getElementById('addToCart').addEventListener('click', () => { Cart.add(product.id, +qtyInput.value || 1); });
  document.getElementById('favBtn').addEventListener('click', (e) => {
    const i = e.currentTarget.querySelector('i');
    i.classList.toggle('fa-solid'); i.classList.toggle('fa-regular');
    e.currentTarget.style.color = i.classList.contains('fa-solid') ? 'var(--gold)' : 'var(--text)';
  });
  const related = document.getElementById('relatedProducts');
  if (related) {
    const others = PRODUCTS.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);
    const fill = others.length >= 4 ? others : PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);
    related.innerHTML = fill.map(productCardHTML).join('');
    bindProductCards(related);
  }
})();
