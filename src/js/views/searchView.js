import { mark } from 'regenerator-runtime';
import icons from 'url:../../img/icons.svg';
import View from './View.js';

class SearchView extends View {
  _parentEl = document.querySelector('.search');

  getQuery() {
    return this._parentEl.querySelector('.search__field').value;
  }

  clear() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  addSearchHandler(callback) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      callback();
    });
  }

 
}

export default new SearchView();
