const d = document,
  $themeBtn = d.querySelector(".theme"),
  $selectors = d.querySelectorAll("[data-light]"),
  $container = d.querySelector(".container"),
  $loader = d.querySelector(".loader"),
  $pokemons = d.querySelector(".pokemons"),
  $buttons = d.querySelector(".buttons"),
  $input = d.querySelector(".input"),
  $btnInputCancel = d.querySelector(".btn-search-cancel"),
  ls = localStorage,
  $fragment = d.createDocumentFragment();

let pokeApi = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=5";

async function loadPokemons(url) {
  try {
    $loader.classList.remove("none");

    let res = await fetch(url),
      json = await res.json(),
      $template = "",
      $prevLink,
      $nextLink;

    // console.log(json);

    if (!res.ok) throw { status: res.status, statusText: res.statusText };

    for (let i = 0; i < json.results.length; i++) {
      try {
        let res = await fetch(json.results[i].url),
          pokemon = await res.json();

        // console.log(res, pokemon);

        if (!res.ok) throw { status: res.status, statusText: res.statusText };

        types = pokemon.types[1]
          ? `<div class="pokemon-types">
          Types: 
          <p style="background-color: var(--${pokemon.types[0].type.name}-color);">${pokemon.types[0].type.name}</p>
          <p style="background-color: var(--${pokemon.types[1].type.name}-color);">${pokemon.types[1].type.name}</p>
          </div>`
          : `<div class="pokemon-types">
          Types:
          <p style="background-color: var(--${pokemon.types[0].type.name}-color);">${pokemon.types[0].type.name}</p>
          </div>`;

        typesModal = pokemon.types[1]
          ? `
          <div class="types-modal">
          <p class="types-modal-p" style="background-color: var(--${pokemon.types[0].type.name}-color);">${pokemon.types[0].type.name}</p>
          <p class="types-modal-p" style="background-color: var(--${pokemon.types[1].type.name}-color);">${pokemon.types[1].type.name}</p>
          </div>`
          : `<div class="types-modal">
          <p style="background-color: var(--${pokemon.types[0].type.name}-color);">${pokemon.types[0].type.name}</p>
          </div>`;

        abilitiesPokemon = pokemon.abilities[1]
          ? `
          <div class="abilities-pokemon-modal">
          <span class="ability-pokemon">${pokemon.abilities[0].ability.name}</span>
          <span>${pokemon.abilities[1].ability.name}</span>
          </div>
        `
          : `
          <div class="abilities-pokemon-modal">
          <span>${pokemon.abilities[0].ability.name}</span>
          </div>
        `;

        const pokeName = `${pokemon.name
          .split("")[0]
          .toUpperCase()}${pokemon.name.slice(1)}`;

        $template += `
<article class="modal none" id="${pokemon.name}">
        <div class="content-modal">
        <article class="pokemon-modal" style="background-color: var(--${pokemon.types[0].type.name}-color);">
        <p>#${pokemon.id}</p>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <div class="content-pokemon-modal">
        <figcaption>${pokeName}</figcaption>
        <div class="pokemon-bar"></div>
        <span>Hp ${pokemon.stats[0].base_stat}</span>
        <article class="info-pokemon-modal">
        <div>${typesModal}
        <span>Types</span>
        </div>
        <div class="info-between">
        <p>${pokemon.weight} kg</p>
        <span>Weight</span>
        </div>
        <div>
        <p>${pokemon.height} m</p>
        <span>Height</span>
        </div>
        </article>
        <div class="stats-pokemon-modal-container">
        <article class="stats-pokemon-modal">
        <div>
        <p>${pokemon.stats[1].stat.name}</p>
        <span>${pokemon.stats[1].base_stat}</span>
        </div>
        <div>
        <p>${pokemon.stats[2].stat.name}</p>
        <span>${pokemon.stats[2].base_stat}</span>
        </div>
        <div>
        <p>${pokemon.stats[3].stat.name}</p>
        <span>${pokemon.stats[3].base_stat}</span>
        </div>
        <div>
        <p>${pokemon.stats[4].stat.name}</p>
        <span>${pokemon.stats[4].base_stat}</span>
        </div>
        <div>
        <p>${pokemon.stats[5].stat.name}</p>
        <span>${pokemon.stats[5].base_stat}</span>
        </div>
        </article>
        <article class="abilities-pokemon-modal-container">
        <p>Abilities</p>
        ${abilitiesPokemon}
        </article>
        <a href="#" class="close-modal" id="cerrar">
        <div>X</div>
        </a>
        </div>
        </div>
        </article>
        </div>
        </article>

        <figure class="pokemon">
        <div class="pokemon-card" style="background-color: var(--${pokemon.types[0].type.name}-color);">
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        </div>
        <figcaption>${pokeName}</figcaption>
        <span>#${pokemon.id}</span>
        ${types}
        <a href=${pokemon.name}>See More</a>
        </figure>
        `;
      } catch (err) {
        // console.log(err);
        let message = err.statusText || "Ocurrió un error";
        $template += `
        <figure>
        <figcaption><p>Error ${err.status}: ${message}</p></figcaption>
        </figure>
        `;
      }
    }

    $loader.classList.add("none");
    $pokemons.innerHTML = $template;
    $prevLink = json.previous
      ? `<a class="back" href="${json.previous}"><</a>`
      : "";
    $nextLink = json.next ? `<a class="next" href="${json.next}">></a>` : "";
    $buttons.innerHTML = `${$prevLink} ${$nextLink}`;
  } catch (err) {
    // console.log(err);
    let message = err.statusText || "Ocurrió un error";
    $pokemons.innerHTML = `<p>Error ${err.status}: ${message}</p>`;
  }
}

// Theme Light/Dark

let moon = "🌙",
  sun = "☀️";

const lightMode = () => {
  $selectors.forEach((el) => el.classList.add("light-mode"));
  $loader.src = "assets/loader-dark.svg";
  $themeBtn.textContent = moon;
  ls.setItem("theme", "light");
};

const darkMode = () => {
  $selectors.forEach((el) => el.classList.remove("light-mode"));
  $loader.src = "assets/loader.svg";
  $themeBtn.textContent = sun;
  ls.setItem("theme", "dark");
};

// Events

d.addEventListener("keyup", (e) => {
  if (e.target.matches(".input")) {
    $btnInputCancel.classList.add("active");
    if ($input.value === "") {
      $btnInputCancel.classList.remove("active");
    }
  }
});

d.addEventListener("click", (e) => {
  if (e.target.matches(".theme")) {
    if ($themeBtn.textContent === sun) {
      lightMode();
    } else {
      darkMode();
    }
  }

  if (e.target.matches(".buttons a")) {
    e.preventDefault();
    loadPokemons(e.target.getAttribute("href"));
  }

  const $modal = d.querySelectorAll(".modal");

  if (e.target.matches(".pokemon a")) {
    e.preventDefault();
    if (e.target.getAttribute("href") === $modal[0].id) {
      $modal[0].classList.remove("none");
    } else if (e.target.getAttribute("href") === $modal[1].id) {
      $modal[1].classList.remove("none");
    } else if (e.target.getAttribute("href") === $modal[2].id) {
      $modal[2].classList.remove("none");
    } else if (e.target.getAttribute("href") === $modal[3].id) {
      $modal[3].classList.remove("none");
    } else if (e.target.getAttribute("href") === $modal[4].id) {
      $modal[4].classList.remove("none");
    }
  }

  if (
    e.target.matches(".close-modal div") ||
    e.target.matches(".close-modal")
  ) {
    e.preventDefault();
    $modal[0].classList.add("none");
    $modal[1].classList.add("none");
    $modal[2].classList.add("none");
    $modal[3].classList.add("none");
    $modal[4].classList.add("none");
  }

  // searchPokemon

  async function searchPokemon(url) {
    try {
      $loader.classList.remove("none");

      let res = await fetch(url),
        pokemon = await res.json(),
        $template = "";

      // console.log(pokemon);

      if (!res.ok) throw { status: res.status, statusText: res.statusText };

      types = pokemon.types[1]
        ? `<div class="pokemon-types">
          Types: 
          <p style="background-color: var(--${pokemon.types[0].type.name}-color);">${pokemon.types[0].type.name}</p>
          <p style="background-color: var(--${pokemon.types[1].type.name}-color);">${pokemon.types[1].type.name}</p>
          </div>`
        : `<div class="pokemon-types">
          Types:
          <p style="background-color: var(--${pokemon.types[0].type.name}-color);">${pokemon.types[0].type.name}</p>
          </div>`;

      typesModal = pokemon.types[1]
        ? `
          <div class="types-modal">
          <p class="types-modal-p" style="background-color: var(--${pokemon.types[0].type.name}-color);">${pokemon.types[0].type.name}</p>
          <p class="types-modal-p" style="background-color: var(--${pokemon.types[1].type.name}-color);">${pokemon.types[1].type.name}</p>
          </div>`
        : `<div class="types-modal">
          <p style="background-color: var(--${pokemon.types[0].type.name}-color);">${pokemon.types[0].type.name}</p>
          </div>`;

      abilitiesPokemon = pokemon.abilities[1]
        ? `
          <div class="abilities-pokemon-modal">
          <span class="ability-pokemon">${pokemon.abilities[0].ability.name}</span>
          <span>${pokemon.abilities[1].ability.name}</span>
          </div>
        `
        : `
          <div class="abilities-pokemon-modal">
          <span>${pokemon.abilities[0].ability.name}</span>
          </div>
        `;

      const pokeName = `${pokemon.name
        .split("")[0]
        .toUpperCase()}${pokemon.name.slice(1)}`;

      $template += `
<article class="modal none" id="${pokemon.name}">
        <div class="content-modal">
        <article class="pokemon-modal" style="background-color: var(--${pokemon.types[0].type.name}-color);">
        <p>#${pokemon.id}</p>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <div class="content-pokemon-modal">
        <figcaption>${pokeName}</figcaption>
        <div class="pokemon-bar"></div>
        <span>Hp ${pokemon.stats[0].base_stat}</span>
        <article class="info-pokemon-modal">
        <div>${typesModal}
        <span>Types</span>
        </div>
        <div class="info-between">
        <p>${pokemon.weight} kg</p>
        <span>Weight</span>
        </div>
        <div>
        <p>${pokemon.height} m</p>
        <span>Height</span>
        </div>
        </article>
        <div class="stats-pokemon-modal-container">
        <article class="stats-pokemon-modal">
        <div>
        <p>${pokemon.stats[1].stat.name}</p>
        <span>${pokemon.stats[1].base_stat}</span>
        </div>
        <div>
        <p>${pokemon.stats[2].stat.name}</p>
        <span>${pokemon.stats[2].base_stat}</span>
        </div>
        <div>
        <p>${pokemon.stats[3].stat.name}</p>
        <span>${pokemon.stats[3].base_stat}</span>
        </div>
        <div>
        <p>${pokemon.stats[4].stat.name}</p>
        <span>${pokemon.stats[4].base_stat}</span>
        </div>
        <div>
        <p>${pokemon.stats[5].stat.name}</p>
        <span>${pokemon.stats[5].base_stat}</span>
        </div>
        </article>
        <article class="abilities-pokemon-modal-container">
        <p>Abilities</p>
        ${abilitiesPokemon}
        </article>
        <a href="#" class="close-modal" id="cerrar">
        <div>X</div>
        </a>
        </div>
        </div>
        </article>
        </div>
        </article>

        <figure class="pokemon">
        <div class="pokemon-card" style="background-color: var(--${pokemon.types[0].type.name}-color);">
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        </div>
        <figcaption>${pokeName}</figcaption>
        <span>#${pokemon.id}</span>
        ${types}
        <a href=${pokemon.name}>See More</a>
        </figure>
        `;

      $pokemons.innerHTML = $template;
    } catch (err) {
      // console.log(err);
      let message = err.statusText || "Ocurrió un error";
      $pokemons.innerHTML = `<p>Error ${err.status}: ${message}</p>`;
    }
    $loader.classList.add("none");
  }

  let pokeApiSearch = `https://pokeapi.co/api/v2/pokemon/${$input.value.toLowerCase()}`;

  if (e.target.matches(".btn-search") || e.target.matches(".btn-search svg")) {
    if ($input.value === "") {
      loadPokemons(pokeApi);
    }
    searchPokemon(pokeApiSearch);
  }

  $input.addEventListener("keyup", (e) => {
    if (e.target.value === "") {
      loadPokemons(pokeApi);
    } else if (e.key === "Enter") {
      searchPokemon(
        `https://pokeapi.co/api/v2/pokemon/${e.target.value.toLowerCase()}`
      );
    }
  });

  if (
    e.target.matches(".btn-search-cancel") ||
    e.target.matches(".btn-search-cancel svg") ||
    e.target.matches(".btn-search-cancel path")
  ) {
    $input.value = "";
    $btnInputCancel.classList.remove("active");
  }
});

d.addEventListener("DOMContentLoaded", (e) => loadPokemons(pokeApi));
