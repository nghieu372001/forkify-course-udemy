import View from './view' //import class View
import icons from 'url:../../img/icons.svg' //import file img/icons.svg
import fracty from "fracty";

class RecipeView extends View {
    _parenElement = document.querySelector('.recipe');
    _errorMessge = 'We could not find that recipe. Please try another one!';
    _message = '';
    //constructor() trống có thể bỏ
 

    addHandlerRender(handler) {
        // event hashchange sẽ kích hoạt khi url thay đổi: http://localhost:1234/ --> http://localhost:1234/#5ed6604591c37cdc054bcd09 hoặc http://localhost:1234/#5ed6604591c37cdc054bcd09 --> http://localhost:1234/#5ed6604591c37cdc054bcb37
        //url phải có .../#{id} || #{id} từ href của thẻ a
        //window.addEventListener('hashchange', showRecipe);
        // event load sẽ kích hoạt khi trang website loading
        //window.addEventListener('load', showRecipe);

        //lưu ý: (có thể thực thi được hàm handler vì closures). Các phương thức và biến trong handler có thể ghi nhớ và truy cập được các phương thức và biến đã tồn tại từ parent scope chúa nó (ở đây là glonbal scope của controller.js ). 
        //Nên hàm handler có thể truy cập đến các hàm như recipeView.renderSpinder, ...
        ['hashchange', 'load'].forEach(ev => {
            window.addEventListener(ev, handler)
        });
    }

    addHandlerUpdateServing(handler) {
      //event delegation
      this._parenElement.addEventListener('click', function(e){
        //closets: tìm element gần nhất từ dưới lên trên
        //querySelector: tìm element gần nhất từ trên xuống dưới có class btn--update-servings
        const btn = e.target.closest('.btn--update-servings');
        if(!btn) return;
        const updateTo = Number(btn.dataset.updateTo);
        if(updateTo > 0) handler(updateTo);
      })
    }

    addHandlerAddBookMark(handler) {
      this._parenElement.addEventListener('click', function(e){
        const btn = e.target.closest('.btn--bookmark');
        if(!btn) return 
        handler();
      })
    }

    _generateMarkup() {
        return  `
        <figure class="recipe__fig">
          <img src="${this._data.image}" alt="${this._data.title}" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>
    
        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}_icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${this._data.cookingTime}</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}_icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${this._data.servings}</span>
            <span class="recipe__info-text">servings</span>
    
            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--update-servings" data-update-to ="${this._data.servings - 1}">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>

              <button class="btn--tiny btn--update-servings" data-update-to ="${this._data.servings + 1}">
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
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${this._data.bookmark ? '-fill' : ''}"></use>
            </svg>
          </button>
        </div>
    
        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
            ${this._data.ingredients.map(this._generateMarkupIngredient).join('')}
          </ul>
        </div>
    
        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${this._data.publisher}</span>. Please check out
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
        `      
    }

    _generateMarkupIngredient(ing) {
        return `
        <li class="recipe__ingredient">
            <svg class="recipe__icon">
            <use href="${icons}#icon-check"></use>
            </svg>
            <div class="recipe__quantity">${ing.quantity ? fracty(ing.quantity).toString() : ''}</div>
            <div class="recipe__description">
            <span class="recipe__unit">${ing.unit}</span>
            ${ing.description}
            </div>
        </li>
        `
    }
      
}

export default new RecipeView();