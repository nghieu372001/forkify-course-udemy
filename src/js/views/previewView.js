import View from "./view"
import icons from 'url:../../img/icons.svg' //import file img/icons.svg


class PreviewView extends View {
    _parenElement = document.querySelector('*');

    _generateMarkup() {
        //window.location.hash: lấy từ thuộc tính href của thẻ a
        //http://localhost:1234/#5ed6604591c37cdc054bcb37 ==> hash = #5ed6604591c37cdc054bcb37
        const id = window.location.hash.slice(1);
        return `
        <li class="preview">
            <a class="preview__link ${this._data.id === id ? 'preview__link--active' : ''}" href="#${this._data.id}">
                <figure class="preview__fig">
                    <img src="${this._data.image}" alt="${this._data.title}" />
                </figure>
                <div class="preview__data">
                    <h4 class="preview__title">${this._data.title}</h4>
                    <p class="preview__publisher">${this._data.publisher}</p>
                    <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
                        <svg>
                        <use href="${icons}#icon-user"></use>
                        </svg>
                    </div>
                </div>
            </a>
        </li>            
        `
    }
}

export default new PreviewView();