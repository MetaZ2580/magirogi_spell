async function loadSpells() {
  const res = await fetch("spells.json");
  const spells = await res.json();

  generateCategoryList(spells);
  render(spells);

  document.getElementById("search").addEventListener("input", () => render(spells));
  document.getElementById("category-filter").addEventListener("change", () => render(spells));
}

/* ▼ 分類を JSON から自動生成 ▼ */
function generateCategoryList(spells) {
  const select = document.getElementById("category-filter");

  const categories = new Set();
  spells.forEach(spell => {
    spell.category.forEach(cat => categories.add(cat));
  });

  Array.from(categories).sort().forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}
/* ▲ 自動生成ここまで ▲ */

function render(spells) {
  const q = document.getElementById("search").value.toLowerCase();
  const category = document.getElementById("category-filter").value;

  const filtered = spells.filter(spell =>
    (spell.name.toLowerCase().includes(q) ||
     spell.effect.toLowerCase().includes(q)) &&
    (!category || spell.category.includes(category))
  );

  document.getElementById("spell-list").innerHTML =
    filtered.map(spell => `
      <a class="card-link" href="spell.html?name=${encodeURIComponent(spell.name)}">
        <div class="card">
          <div class="card-title">${spell.name}</div>
          ${spell.category.map(cat => `<span class="tag">${cat}</span>`).join("")}
        </div>
      </a>
    `).join("");
}

loadSpells();
