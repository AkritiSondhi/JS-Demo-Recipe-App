import Search from "./model/Serach";
import Recipe from "./model/Recipe";
import List from "./model/List";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
import * as recipeView from "./view/recipeView";
import * as listView from "./view/listView";

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
  recipeView.clearRecipe();
  const id = window.location.hash.replace("#", "");
  if (id) {
    renderLoader(elements.recipe);
    if (state.search) {
      searchView.highlightSelected(id);
    }
    state.recipe = new Recipe(id);

    try {
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      state.recipe.calculateServings();
      state.recipe.calculateTime();

      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch (error) {
      alert(error);
    }
  }
};

const updateShoppingList = () => {
  if (!state.list) {
    state.list = new List();
  }

  state.recipe.ingredients.forEach((current) => {
    const addedItem = state.list.addItem(
      current.count,
      current.unit,
      current.ingredient
    );
    listView.renderItem(addedItem);
  });
};

elements.shoppingList.addEventListener("click", (element) => {
  const id = element.target.closest(".shopping__item").dataset.itemid;

  if (element.target.matches(".shopping__delete, .shopping__delete *")) {
    state.list.deleteItem(id);
    listView.deleteItem(id);
  }
});

[("hashchange", "load")].forEach((event) =>
  window.addEventListener(event, updateRecipe)
);

elements.recipe.addEventListener("click", (event) => {
  if (event.target.matches(".btn-decrease, .btn-decrease *")) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (event.target.matches(".btn-increase, .btn-increase *")) {
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (event.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    updateShoppingList();
  }
});
