(() => {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  const state = { cats: ['all'], types: [], maxPrice: 100, sort: 'featured' };
  function applyFilters() {
    let list = PRODUCTS.slice();
    if (!state.cats.includes('all') && state.cats.length) list = list.filter(p => state.cats.includes(p.category));
    if (state.types.length) list = list.filter(p => state.types.includes(p.type));
    list = list.filter(p => p.price <= state.maxPrice);
    switch (state.sort) {
      case 'price-asc': list.sort((a,b) => a.price - b.price); break;
      case 'price-desc': list.sort((a,b) => b.price - a.price); break;
      case 'name': list.sort((a,b) => a.name.localeCompare(b.name)); break;
      default: list.sort((a,b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return list;
  }
  function render() {
    const list = applyFilters();
    document.getElementById('resultCount').textContent = list.length + (list.length === 1 ? ' producto' : ' productos');
    if (!list.length) {
      grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:80px 20px; color:var(--text-soft);"><i class="fa-solid fa-mug-hot" style="font-size:48px;color:var(--gold);margin-bottom:16px;"></i><h3 style="font-family:var(--font-serif);font-size:28px;font-weight:500;margin-bottom:8px;">Sin resultados</h3><p>Prueba ajustando los filtros.</p></div>`;
      return;
    }
    grid.innerHTML = list.map(productCardHTML).join('');
    bindProductCards(grid);
  }
  const catBoxes = document.querySelectorAll('.filter-cat');
  catBoxes.forEach(box => {
    box.addEventListener('change', () => {
      if (box.value === 'all') {
        if (box.checked) { catBoxes.forEach(b => { if (b.value !== 'all') b.checked = false; }); state.cats = ['all']; } else { box.checked = true; }
      } else {
        const allBox = document.querySelector('.filter-cat[value="all"]');
        if (box.checked) allBox.checked = false;
        const checked = Array.from(catBoxes).filter(b => b.value !== 'all' && b.checked).map(b => b.value);
        if (!checked.length) { allBox.checked = true; state.cats = ['all']; } else state.cats = checked;
      }
      render();
    });
  });
  document.querySelectorAll('.filter-type').forEach(box => {
    box.addEventListener('change', () => {
      state.types = Array.from(document.querySelectorAll('.filter-type:checked')).map(b => b.value);
      render();
    });
  });
  const priceRange = document.getElementById('priceRange');
  const priceMax = document.getElementById('priceMax');
  priceRange.addEventListener('input', () => { state.maxPrice = +priceRange.value; priceMax.textContent = '$' + state.maxPrice; render(); });
  document.getElementById('sortBy').addEventListener('change', (e) => { state.sort = e.target.value; render(); });
  document.getElementById('clearFilters').addEventListener('click', () => {
    catBoxes.forEach(b => b.checked = b.value === 'all');
    document.querySelectorAll('.filter-type').forEach(b => b.checked = false);
    priceRange.value = 100; priceMax.textContent = '$100';
    document.getElementById('sortBy').value = 'featured';
    state.cats = ['all']; state.types = []; state.maxPrice = 100; state.sort = 'featured';
    render();
  });
  const filterToggle = document.getElementById('filterToggle');
  const filters = document.getElementById('filters');
  if (filterToggle && filters) {
    filterToggle.addEventListener('click', () => filters.classList.toggle('open'));
    filters.addEventListener('click', (e) => { if (e.target === filters) filters.classList.remove('open'); });
  }
  render();
})();
