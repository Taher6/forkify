import { async, mark } from 'regenerator-runtime';
import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';

import View from './View.js';
class BookmarksView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = `
  No recipes found for your query! Please try again
  `;

  _message = `
          No bookmarks yet. Find a nice recipe and bookmark it :)
  `;

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderMessage();
    }
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  _generateMarkup() {
    const markupArr = this._data.map(recipe => {
      return `
      <li class="preview">
      <a class="preview__link " href="#${recipe.id}">
        <figure class="preview__fig">
          <img src="${recipe.image}" alt="Test" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${recipe.title}</h4>
          <p class="preview__publisher">${recipe.publisher}</p>
          <div class="recipe__user-generated ${recipe.key ? '' : 'hidden'}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
        </div>
      </a>
    </li>
          `;
    });

    return markupArr;
  }

  bookmarkDisplayHandler(callback) {
    document
      .querySelector('.nav__btn--bookmarks')
      .addEventListener('mouseover', callback);
  }
}

export default new BookmarksView();
