import axios from "axios";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(
        `https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
      );

      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error) {
      console.error(error);
    }
  }

  calculateTime() {
    const ingredientsCount = this.ingredients.length;
    const periods = Math.ceil(ingredientsCount / 3);
    this.time = periods * 15;
  }

  calculateServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = [
      "tablespoons",
      "tablespoon",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "cups",
      "pounds",
    ];
    const unitsShort = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "cup",
      "pound",
    ];
    const units = [...unitsShort, "kg", "g"];

    const newIngredients = this.ingredients.map((element) => {
      let ingredient = element.toLowerCase();
      unitsLong.forEach((current, index) => {
        ingredient = ingredient.replace(current, unitsShort[index]);
      });

      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

      const arrIngredientParts = ingredient.split(" ");
      const unitIndex = arrIngredientParts.findIndex((ingredientElement) =>
        units.includes(ingredientElement)
      );

      let objectIngredient;
      if (unitIndex > -1) {
        let count;
        const arrCount = arrIngredientParts.slice(0, unitIndex);

        if (arrCount.length === 1) {
          count = eval(arrCount[0].replace("-", "+"));
        } else {
          count = eval(arrCount.slice(0, unitIndex).join("+"));
        }

        objectIngredient = {
          count,
          unit: arrIngredientParts[unitIndex],
          ingredient: arrIngredientParts.slice(unitIndex + 1).join(" "),
        };
      } else if (parseInt(arrIngredientParts[0], 10)) {
        objectIngredient = {
          count: parseInt(arrIngredientParts[0], 10),
          unit: "",
          ingredient: arrIngredientParts.slice(1).join(" "),
        };
      } else if (unitIndex === -1) {
        objectIngredient = {
          count: 1,
          unit: "",
          ingredient,
        };
      }

      return objectIngredient;
    });
    this.ingredients = newIngredients;
  }
}
