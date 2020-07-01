import Search from "./model/Serach";
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

    await state.search.getRecipes();

    clearLoader();
    searchView.rederResults(state.search.recipes);
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
