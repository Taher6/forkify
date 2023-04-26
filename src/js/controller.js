import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import personalRecipeView from './views/personalRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { getJSON } from './helpers.js';

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const controlServings = function (oldServings) {
  //Update the recipe servings(in state)
  model.updateServings(model.state.recipe.servings, oldServings);
  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  recipeView.setBookmark(model.addBookmark, model.removeBookmark);
  recipeView.checkStorage(model.addToStorage, model.removeFromStorage);
};

const controlRecipes = async function () {
  try {
    const recipeHash = window.location.hash.slice(1);
    if (!recipeHash) return;
    recipeView.renderSpinner();
    //1) Loading Recipe
    await model.loadRecipe(recipeHash);

    recipeView.render(model.state.recipe);

    model.bookmarkedRecipes.forEach(bookmarkedRec => {
      if (model.state.recipe.id === bookmarkedRec.id) {
        recipeView.addFill();
      }
    });
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function (page) {
  try {
    resultsView.renderSpinner();
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;
    // 2) Load search query
    await model.loadSearchResults(query);
    model.getSearchResultsPage(1);
    searchView.clear();
    resultsView.render(model.getSearchResultsPage(page));
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = async function (page) {
  try {
    resultsView.renderSpinner();
    model.getSearchResultsPage(page);
    searchView.clear();
    resultsView.render(model.getSearchResultsPage(page));
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};
const controlDisplayBookmarks = function () {
  bookmarksView.render(model.bookmarkedRecipes);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    recipeView.renderSpinner();
    //Upload the new recipe data

    personalRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);

    personalRecipeView.renderMessage('Recipe Uploaded Successfully');
    //Render recipe

    // recipeView.render(model.state.recipe);

    location.hash = model.state.recipe.id;

    // Close form window
    await personalRecipeView.wait(1);

    personalRecipeView.toggleWindow();

    await personalRecipeView.wait(0.5);

    personalRecipeView.render(model.state.recipe);

    personalRecipeView.handlerDeleter();

    // bookmark
    recipeView.addFill();
  } catch (err) {
    console.log(err);
    personalRecipeView.renderError(err.message);
  }
};
const init = async function () {
  searchView.addSearchHandler(controlSearchResults);
  resultsView.addActiveHandler();
  paginationView.addPaginationHandler(
    model.state.search.page,
    controlPagination
  );

  recipeView.addHandlerRender(controlRecipes);

  recipeView.addServingsHandler(controlServings);
  recipeView.addBookmarkHandler(controlAddBookmark);
  bookmarksView.bookmarkDisplayHandler(controlDisplayBookmarks);
  // personalRecipeView.addOverlayHandler();
  // personalRecipeView.closeOverlayHandler();
  // personalRecipeView.addUploadHandler();
  personalRecipeView.addOverlayHandler(personalRecipeView.boundOverlayHandler);
  personalRecipeView.addUploadHandler(controlAddRecipe);
};
init();
