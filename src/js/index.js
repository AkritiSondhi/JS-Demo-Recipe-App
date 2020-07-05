import Search from "./model/Serach";
import Recipe from "./model/Recipe";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";

/**
 * Gloabl State of the app.
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

const controlSearch = async () => {
  const query = searchView.getInput();

  if (query) {
    state.search = new Search(query);

    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchResultList);

    try {
      await state.search.getRecipes();
      clearLoader();
      searchView.rederResults(state.search.recipes);
    } catch (error) {
      clearLoader();
      alert(error);
    }
  }
};

elements.searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener("click", (event) => {
  const button = event.target.closest(".btn-inline");

  if (button) {
    const goToPage = parseInt(button.dataset.goto, 10);
    searchView.clearResults();
    searchView.rederResults(state.search.recipes, goToPage);
  }
});

const updateRecipe = async () => {
  const id = window.location.hash.replace("#", "");
  if (id) {
    state.recipe = new Recipe(id);

    try {
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      state.recipe.calculateServings();
      state.recipe.calculateTime();
    } catch (error) {
      alert(error);
    }
  }
};

["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, updateRecipe)
);
