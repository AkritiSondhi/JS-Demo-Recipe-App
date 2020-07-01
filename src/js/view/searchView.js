import { elements } from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = "";
};

export const clearResults = () => {
  elements.searchResultList.innerHTML = "";
  elements.searchResPages.innerHTML = "";
};

const limitRecipeTitle = (recipeTitle, limit = 17) => {
  if (recipeTitle.length > limit) {
    const newTitle = new Array();
    recipeTitle.split(" ").reduce((accumulator, current) => {
      if (accumulator + current.length <= limit) {
        newTitle.push(current);
      }
      return accumulator + current.length;
    }, 0);

    return `${newTitle.join(" ")} ...`;
  }
  return recipeTitle;
};

const renderRecipe = (recipe) => {
  const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;

  elements.searchResultList.insertAdjacentHTML("beforeend", markup);
};

const createButton = (pageNumber, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${
  type === "prev" ? pageNumber - 1 : pageNumber + 1
}>
        <span>Page ${type === "prev" ? pageNumber - 1 : pageNumber + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${
              type === "prev" ? "left" : "right"
            }"></use>
        </svg>
    </button>
`;

const renderButtons = (page, resultsCount, resultsPerPage) => {
  const pages = Math.ceil(resultsCount / resultsPerPage);
  let button;

  if (page === 1 && pages > 1) {
    button = createButton(1, "next");
  } else if (page < pages) {
    button = `
        ${createButton(page, "prev")}
        ${createButton(page, "next")}
    `;
  } else if (page > 1 && page == pages) {
    button = createButton(page, "prev");
  }

  elements.searchResPages.insertAdjacentHTML("afterbegin", button);
};

export const rederResults = (recipes, page = 1, resultsPerPage = 10) => {
  const start = (page - 1) * resultsPerPage;
  const end = page * resultsPerPage;
  recipes.slice(start, end).forEach((element) => {
    renderRecipe(element);
  });

  renderButtons(page, recipes.length, resultsPerPage);
};
