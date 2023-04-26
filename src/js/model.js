import { async } from 'regenerator-runtime';
import { API_URL } from './config.js';
import { RES_PER_PAGE } from './config.js';
import { KEY } from './config.js';
import { AJAX } from './helpers.js';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

export let bookmarkedRecipes = Object.entries({ ...localStorage }).map(
  recipe => {
    return JSON.parse(recipe[1]);
  }
);

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (recipeHash) {
  try {
    const data = await AJAX(`${recipeHash}?key=${KEY}`);
    // console.log(recipe);
    // state.recipe = {
    //   id: recipe.id,
    //   title: recipe.title,
    //   publisher: recipe.publisher,
    //   sourceUrl: recipe.source_url,
    //   image: recipe.image_url,
    //   servings: recipe.servings,
    //   cookingTime: recipe.cooking_time,
    //   ingredients: recipe.ingredients,
    //   ...(recipe.key && { key: recipe.key }),
    // };
    state.recipe = createRecipeObject(data);
  } catch (err) {
    console.err(err);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    const { data } = await AJAX(`?search=${query}&key=${KEY}`);
    state.search.query = query;
    state.search.results = data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (servingSize, oldServings) {
  state.recipe.ingredients.forEach(ing => {
    const ingQuantity = ing.quantity;
    const newServings = servingSize;
    ing.quantity = ingQuantity * (newServings / oldServings);
  });
};

export const addBookmark = function (recipe) {
  //Add bookmark
  state.bookmarks.push(recipe);
  bookmarkedRecipes.push(recipe);
  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
};

export const removeBookmark = function (recipe) {
  state.bookmarks = state.bookmarks.filter(
    bookRecipe => bookRecipe.id !== recipe.id
  );
  bookmarkedRecipes = bookmarkedRecipes.filter(
    bookRecipe => bookRecipe.id !== recipe.id
  );
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = false;
};

export const addToStorage = function (id, recipe) {
  localStorage.setItem(`${id}`, recipe);
};

export const removeFromStorage = function (id, recipe) {
  localStorage.removeItem(`${id}`, recipe);
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const userRecipe = newRecipe;

    const ingredients = Object.entries(userRecipe).filter(item => {
      return item[1] !== '' && item[0].includes('ingredient');
    });
    const fromIngredients = ingredients.map(ing => {
      return ing[1].split(',');
    });

    const ingObj = fromIngredients.map(ing => {
      if (ing.length !== 3) {
        throw new Error(
          'Ingredient field items need to be  seperated by a comma'
        );
      }

      return {
        quantity: ing[0] === '' ? null : Number(ing[0]),
        unit: ing[1],
        description: ing[2],
      };
    });
    const finalRecipeArr = Object.entries(userRecipe).filter(item => {
      return !item[0].includes('-');
    });
    const finalRecipeObj = Object.fromEntries(finalRecipeArr);

    finalRecipeObj.ingredients = ingObj;
    finalRecipeObj.cookingTime = Number(finalRecipeObj.cookingTime);
    finalRecipeObj.servings = Number(finalRecipeObj.servings);

    const recipe = {
      title: finalRecipeObj.title,
      publisher: finalRecipeObj.publisher,
      source_url: finalRecipeObj.sourceUrl,
      image_url: finalRecipeObj.image,
      servings: +finalRecipeObj.servings,
      cooking_time: +finalRecipeObj.cookingTime,
      ingredients: finalRecipeObj.ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
    addToStorage(state.recipe.id, JSON.stringify(state.recipe));
  } catch (err) {
    throw err;
  }
};
