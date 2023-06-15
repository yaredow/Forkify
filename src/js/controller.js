import { async } from 'regenerator-runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import paginationView from './views/paginationView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
// Load the spin  ner

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    // Loading recipe
    await model.loadRecipe(id);

    // Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // Get query
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();
    console.log(query);

    // Load search result
    await model.loadSearchResult(query);
    // Render search result
    console.log(model.state.search.result);
    resultsView.render(model.getSearchResultsPage(1));

    // Rendering pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Rendering new pagination
  paginationView.render(model.state.search);
};

const controlServing = function (newServings) {
  model.updateServing(newServings);

  recipeView.render(model.state.recipe);
};

const controlAddBokmark = function () {
  // Add or remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.state.recipe.bookmarked;
  model.deleteBookmark(model.state.recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// Change ID in URL

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServing(controlServing);
  searchView.addHandlerSearch(controlSearchResults);
  recipeView.addHandlerAddBookmark(controlAddBokmark);
  paginationView.addHandlerClick(controlPagination);
  controlServing();
};
init();
