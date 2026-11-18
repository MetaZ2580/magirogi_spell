let currentMode = "player";
let currentFile = "spells.json";
let spells = [];

async function loadSpells() {
  const res = await fetch(currentFile);
  spells = await res.json();

  const categoryFilter = document.getElementById("category-filter");
  categoryFilter.innerHTML = '<option value="">分類（すべて）</option>';

  generateCategoryList(spells);
  render();

  const title = document.getElementById("title");

  if (currentMode === "gm") {
    title.textContent = "マギカロギアGM魔法検索";
  } else {
    title.textContent = "マギカロギア魔法検索";
  }
}

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

function render() {
  const q = document.getElementById("search").value.toLowerCase();
  const category = document.getElementById("category-filter").value;
  const type = document.getElementById("typeFilter").value;

  const filtered = spells.filter(spell =>
    (spell.name.toLowerCase().includes(q) ||
      spell.effect.toLowerCase().includes(q)) &&
    (!category || spell.category.includes(category)) &&
    (!type || spell.type === type)
  );

  document.getElementById("spell-list").innerHTML =
    filtered.map(spell => `
      <a class="card-link"
         href="spell.html?mode=${currentMode}&name=${encodeURIComponent(spell.name)}">
        <div class="card">
          <div class="card-title">${spell.name}</div>
          ${spell.category.map(cat =>
            `<span class="tag">${cat}</span>`
          ).join("")}
        </div>
      </a>
    `).join("");
}

document.getElementById("search")
  .addEventListener("input", render);

document.getElementById("category-filter")
  .addEventListener("change", render);

document.getElementById("typeFilter")
  .addEventListener("change", render);

document.getElementById("playerMode")
  .addEventListener("click", () => {
    currentMode = "player";
    currentFile = "spells.json";
    loadSpells();
  });

document.getElementById("gmMode")
  .addEventListener("click", () => {
    currentMode = "gm";
    currentFile = "gm-spells.json";
    loadSpells();
  });

loadSpells();
