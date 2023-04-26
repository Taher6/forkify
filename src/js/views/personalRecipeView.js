import { mark } from 'regenerator-runtime';
import icons from 'url:../../img/icons.svg';
import View from './View.js';

class PersonalRecipeView extends View {
  _parentEl = document.querySelector('.upload');

  wait(sec) {
    return new Promise(function (resolve) {
      setTimeout(resolve, sec * 1000);
    });
  }

  _generateMarkup() {
    return `
    <div class="upload__column">
          <h3 class="upload__heading">Recipe data</h3>
          <label>Title</label>
          <input value="TEST23" required name="title" type="text" />
          <label>URL</label>
          <input value="TEST23" required name="sourceUrl" type="text" />
          <label>Image URL</label>
          <input value="TEST23" required name="image" type="text" />
          <label>Publisher</label>
          <input value="TEST23" required name="publisher" type="text" />
          <label>Prep time</label>
          <input value="23" required name="cookingTime" type="number" />
          <label>Servings</label>
          <input value="23" required name="servings" type="number" />
        </div>

        <div class="upload__column">
          <h3 class="upload__heading">Ingredients</h3>
          <label>Ingredient 1</label>
          <input
            value="0.5,kg,Rice"
            type="text"
            required
            name="ingredient-1"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 2</label>
          <input
            value="1,,Avocado"
            type="text"
            name="ingredient-2"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 3</label>
          <input
            value=",,salt"
            type="text"
            name="ingredient-3"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 4</label>
          <input
            type="text"
            name="ingredient-4"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 5</label>
          <input
            type="text"
            name="ingredient-5"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 6</label>
          <input
            type="text"
            name="ingredient-6"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
        </div>

        <button class="btn upload__btn">
          <svg>
            <use href="${icons}#icon-upload-cloud"></use>
          </svg>
          <span>Upload</span>
        </button>
    `;
  }

  toggleWindow() {
    // document.querySelector('.overlay').classList.add('hidden');
    document.querySelector('.add-recipe-window').classList.add('hidden');
  }

  // async overlayHandler() {
  //   const personalRecipeWindow = document.querySelector('.add-recipe-window');
  //   personalRecipeWindow.classList.remove('hidden');
  //   await this.wait(0.35);
  //   this.closeOverlayHandler();
  // }

  // boundOverlayHandler = this.overlayHandler.bind(this);

  // addOverlayHandler() {
  //   document
  //     .querySelector('.nav__btn--add-recipe')
  //     .addEventListener('click', this.boundOverlayHandler);
  // }

  // closeOverlay(e) {
  //   const personalRecipeWindow = document.querySelector('.add-recipe-window');
  //   console.log(e.target.closest('.add-recipe-window'));
  //   if (
  //     e.target.classList.contains('btn--close-modal') ||
  //     e.target.closest('.add-recipe-window') === null
  //   ) {
  //     console.log(personalRecipeWindow.classList.contains('hidden') === false);
  //     personalRecipeWindow.classList.add('hidden');
  //     this.handlerDeleter();
  //   }
  // }

  // boundCloseOverlay = this.closeOverlay.bind(this);

  // handlerDeleter() {
  //   document.removeEventListener('click', this.boundCloseOverlay);
  // }

  // async closeOverlayHandler() {
  //   if (
  //     document.querySelector('.add-recipe-window').classList.contains('hidden')
  //   )
  //     return;
  //   await this.wait(0.8);
  //   document.addEventListener('click', this.boundCloseOverlay);
  // }

  addUploadHandler(callback) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      const recipeData = [...new FormData(this)];
      const recipe = Object.fromEntries(recipeData);

      callback(recipe);
    });
  }

  async _overlayHandler() {
    const personalRecipeWindow = document.querySelector('.add-recipe-window');
    if (personalRecipeWindow.classList.contains('hidden') === false) {
      personalRecipeWindow.classList.add('hidden');
      return;
    } else {
      personalRecipeWindow.classList.remove('hidden');
      await this.wait(0.8);
      this._addCloseOverlayHandler(this._boundCloseOverlay);
    }

    // await this.wait(0.35);
    // this.closeOverlayHandler();
  }

  boundOverlayHandler = this._overlayHandler.bind(this);

  addOverlayHandler(openOverlayCallback) {
    document
      .querySelector('.nav__btn--add-recipe')
      .addEventListener('click', openOverlayCallback);
  }

  _closeOverlay(e) {
    const personalRecipeWindow = document.querySelector('.add-recipe-window');
    if (
      e.target.classList.contains('btn--close-modal') ||
      e.target.closest('.add-recipe-window') === null
    ) {
      personalRecipeWindow.classList.add('hidden');
      this.handlerDeleter();
    }
  }

  _boundCloseOverlay = this._closeOverlay.bind(this);

  _addCloseOverlayHandler(closeOverlayCallback) {
    // if (
    //   document.querySelector('.add-recipe-window').classList.contains('hidden')
    // )
    // return;
    document.addEventListener('click', closeOverlayCallback);
  }

  handlerDeleter() {
    document.removeEventListener('click', this._boundCloseOverlay);
  }
}

export default new PersonalRecipeView();
