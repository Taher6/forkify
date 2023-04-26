import { async } from 'regenerator-runtime';
import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';

import View from './View.js';
class RecipeView extends View {
  _parentEl = document.querySelector('.recipe');
  _errorMessage = 'Recipe not found. Please try another recipe.';
  _message = '';

  addHandlerRender(callback) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, callback));
  }

  addServingsHandler(callback) {
    const servingsHandler = function (e) {
      if (
        e.target.closest('div').classList.contains('recipe__info-buttons') &&
        e.target
          .closest('.btn--tiny')
          .classList.contains('btn--increase-servings')
      ) {
        this._data.servings += 1;
        callback(this._data.servings - 1);
      } else if (
        e.target.closest('div').classList.contains('recipe__info-buttons') &&
        e.target
          .closest('.btn--tiny')
          .classList.contains('btn--decrease-servings')
      ) {
        this._data.servings -= 1;
        callback(this._data.servings + 1);
      } else {
        return;
      }
    };
    const bindServingsHandler = servingsHandler.bind(this);
    this._parentEl.addEventListener('click', bindServingsHandler);
  }

  setBookmark(addBookmark, removeBookmark) {
    const bookmarkIcon = this._parentEl
      .querySelector('.btn--round')
      .querySelector('use');
    if (bookmarkIcon.getAttribute('href') !== `${icons}#icon-bookmark-fill`) {
      bookmarkIcon.setAttribute('href', `${icons}#icon-bookmark-fill`);
      addBookmark(this._data);
    } else {
      bookmarkIcon.setAttribute('href', `${icons}#icon-bookmark`);
      removeBookmark(this._data);
    }
  }

  checkStorage(addToStorage, removeFromStorage) {
    const bookmarkIcon = this._parentEl
      .querySelector('.btn--round')
      .querySelector('use');
    if (bookmarkIcon.getAttribute('href') !== `${icons}#icon-bookmark-fill`) {
      removeFromStorage(this._data.id, JSON.stringify(this._data));
    } else {
      addToStorage(this._data.id, JSON.stringify(this._data));
    }
  }

  _checkBookmark() {
    if (this._data.bookmarked === undefined) return `${icons}#icon-bookmark`;
    this._data.bookmarked
      ? `${icons}#icon-bookmark-fill`
      : `${icons}#icon-bookmark`;
  }

  addFill() {
    const bookmarkIcon = this._parentEl
      .querySelector('.btn--round')
      .querySelector('use');
    bookmarkIcon.setAttribute('href', `${icons}#icon-bookmark-fill`);
  }

  addBookmarkHandler(callback) {
    this._parentEl.addEventListener('click', function (e) {
      if (e.target.closest('button')?.classList.contains('btn--round')) {
        callback();
      }
    });
  }

  _generateMarkup() {
    const ing = this._data.ingredients.map(ing => {
      return ` <li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use href="${icons}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${
          ing.quantity ? new Fraction(ing.quantity).toString() : ''
        }</div>
        <div class="recipe__description">
          <span class="recipe__unit">${ing.unit}</span>
          ${ing.description}
        </div>
      </li>`;
    });
    const ingMarkup = ing.join('');
    return `
   <figure class="recipe__fig">
     <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
    
    <h1 class="recipe__title">
      <span>${this._data.title}</span>
    </h1>
  </figure>

  <div class="recipe__details">
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-clock"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--minutes">${
        this._data.cookingTime
      }</span>
      <span class="recipe__info-text">minutes</span>
    </div>
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-users"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--people">${
        this._data.servings
      }</span>
      <span class="recipe__info-text">servings</span>

      <div class="recipe__info-buttons">
        <button class="btn--tiny btn--decrease-servings">
          <svg>
            <use href="${icons}#icon-minus-circle"></use>
          </svg>
        </button>
        <button class="btn--tiny btn--increase-servings">
          <svg>
            <use href="${icons}#icon-plus-circle"></use>
          </svg>
        </button>
      </div>
    </div>
    
    <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
    <svg>
      <use href="${icons}#icon-user"></use>
    </svg>
    </div>
    
    <button class="btn--round">
      <svg class="">
        <use href=${this._checkBookmark()}></use>
      </svg>
    </button>
  </div>

  <div class="recipe__ingredients">
    <h2 class="heading--2">Recipe ingredients</h2>
    <ul class="recipe__ingredient-list">
      ${ingMarkup}
    </ul>
  </div>

  <div class="recipe__directions">
    <h2 class="heading--2">How to cook it</h2>
    <p class="recipe__directions-text">
      This recipe was carefully designed and tested by
      <span class="recipe__publisher">${
        this._data.publisher
      }</span>. Please check out
      directions at their website.
    </p>
    <a
      class="btn--small recipe__btn"
      href="${this._data.sourceUrl}"
      target="_blank"
    >
      <span>Directions</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </a>
  </div>
    `;
  }
}

export default new RecipeView();
