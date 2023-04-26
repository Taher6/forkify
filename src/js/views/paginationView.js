import { async } from 'regenerator-runtime';
import icons from 'url:../../img/icons.svg';

import View from './View.js';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');
  _errorMessage = 'No recipes found for your query! Please try again';
  _message = '';

  _generateMarkup() {
    //Page1, and there are no other pages

    if (
      this._data.page === 1 &&
      this._data.results.length <= this._data.resultsPerPage
    )
      return;

    //Page 1, and there are other pages

    if (
      this._data.page === 1 &&
      this._data.results.length > this._data.resultsPerPage
    ) {
      return `
        <button class="btn--inline pagination__btn--next" data-page="${
          this._data.page + 1
        }">
                <span>Page ${this._data.page + 1}</span>
                <svg class="search__icon">
                  <use href="${icons}#icon-arrow-right"></use>
                </svg>
              </button>
        `;
    }
    // Page 2, and there are no pages after

    if (
      this._data.results.length > this._data.resultsPerPage &&
      this._data.results.slice(this._data.page * 10 - 10, this._data.page * 10)
        .length <= this._data.resultsPerPage &&
      this._data.results.slice(
        (this._data.page + 1) * 10 - 10,
        (this._data.page + 1) * 10
      ).length === 0
    ) {
      return `<button class="btn--inline pagination__btn--prev" data-page="${
        this._data.page - 1
      }">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.page - 1}</span>
          </button>`;
    }
    // Page 2, and there are pages after

    if (
      this._data.results.length > this._data.resultsPerPage &&
      this._data.results.length >
        this._data.results.slice(
          this._data.page * 10 - 10,
          this._data.page * 10
        ).length
    )
      console.log(
        this._data.results.length > this._data.resultsPerPage &&
          this._data.results.length >
            this._data.results.slice(
              this._data.page * 10 - 10,
              this._data.page * 10
            ).length
      );
    return `<button class="btn--inline pagination__btn--prev" data-page="${
      this._data.page - 1
    }">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.page - 1}</span>
          </button>
          <button class="btn--inline pagination__btn--next" data-page="${
            this._data.page + 1
          }">
            <span> Page ${this._data.page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
          `;
  }

  addPaginationHandler(page, callback) {
    this._parentEl.addEventListener('click', function (e) {
      if (
        e.target
          .closest('.btn--inline')
          .classList.contains('pagination__btn--prev')
      ) {
        const newPage = Number(e.target.closest('.btn--inline').dataset.page);
        callback(newPage);
      }

      if (
        e.target
          .closest('.btn--inline')
          .classList.contains('pagination__btn--next')
      ) {
        const newPage = Number(e.target.closest('.btn--inline').dataset.page);
        callback(newPage);
      }
    });
  }
}

export default new PaginationView();
