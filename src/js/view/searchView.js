import { elements } from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = "";
};

export const clearResults = () => {
  elements.searchResultList.innerHTML = "";
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

export const rederResults = (recipes) => {
  recipes.forEach((element) => {
    renderRecipe(element);
  });
};
