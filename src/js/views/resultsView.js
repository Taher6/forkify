import { async } from 'regenerator-runtime';
import icons from 'url:../../img/icons.svg';

import View from './View.js';

class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again';
  _message = '';

  _generateMarkup() {
    console.log(this._data);
    const markupArr = this._data.map((preview, i) => {
      return `
      <li class="preview">
      <a class="preview__link " href="#${preview.id}">
        <figure class="preview__fig">
          <img src="${preview.image}" alt="Test" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${preview.title}</h4>
          <p class="preview__publisher">${preview.publisher}</p>
          <div class="recipe__user-generated ${preview.key ? '' : 'hidden'}">
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

  addActiveHandler() {
    this._parentEl.addEventListener('click', function (e) {
      if (document.querySelector('.preview__link--active')) {
        document
          .querySelector('.preview__link--active')
          ?.classList.remove('preview__link--active');
      }
      e.target.closest('.preview')?.classList.add('preview__link--active');
    });
  }
}

export default new ResultsView();
