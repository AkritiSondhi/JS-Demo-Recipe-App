import Search from "./model/Serach";
import Recipe from "./model/Recipe";
import List from "./model/List";
import Likes from "./model/Likes";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
import * as recipeView from "./view/recipeView";
import * as listView from "./view/listView";
import * as likesView from "./view/likesView";

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
    recipeView.clearRecipe();
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
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
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

const updateLikes = () => {
  if (!state.likes) {
    state.likes = new Likes();
  }

  const currentId = state.recipe.id;

  if (!state.likes.isLiked(currentId)) {
    const newLike = state.likes.addLikedRecipe(
      currentId,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    likesView.toggleLikeButton(true);
    likesView.renderLike(newLike);
  } else {
    state.likes.removeLikedRecipe(currentId);
    likesView.toggleLikeButton(false);
    likesView.deleteLike(currentId);
  }
  likesView.toggleLikeMenu(state.likes.getLikesCount());
};

elements.shoppingList.addEventListener("click", (element) => {
  const id = element.target.closest(".shopping__item").dataset.itemid;

  if (element.target.matches(".shopping__delete, .shopping__delete *")) {
    state.list.deleteItem(id);
    listView.deleteItem(id);
  }
});

["hashchange", "load"].forEach((event) =>
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
  } else if (event.target.matches(".shopping__count-value")) {
    const value = parseFloat(event.target.value, 10);
    state.list.updateCount(id, value);
  } else if (event.target.matches(".recipe__love, .recipe__love *")) {
    updateLikes();
  }
});

window.addEventListener("load", () => {
  state.likes = new Likes();
  state.likes.readStorage();
  likesView.toggleLikeMenu(state.likes.getLikesCount());
  state.likes.likes.forEach((like) => {
    likesView.renderLike(like);
  });
});
