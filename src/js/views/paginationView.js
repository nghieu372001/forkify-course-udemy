import View from "./view"
import icons from 'url:../../img/icons.svg' //import file img/icons.svg

class PaginationView extends View {
    _parenElement = document.querySelector('.pagination');
    _errorMessge = '';
    _message = '';

    addHanlderClick(handler) {
        this._parenElement.addEventListener('click', function(e){
            //closets: tìm element gần nhất từ dưới lên trên
            //querySelector: tìm element gần nhất từ trên xuống dưới có class btn--inline
            const btn = e.target.closest('.btn--inline');
            if(!btn) return
            const goToPage = Number(btn.dataset.goto);
            handler(goToPage);
        });
    }

    _generateMarkup() {
        const curPage = this._data.page;
        const numPages = Math.ceil(this._data.result.length / this._data.resultPerPage);
        //Page 1, and there are other pages
        if(curPage === 1 && numPages > 1) {
            return `   
            <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${curPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
            `
        }
        //Last page
        if(curPage === numPages) {
            return `
            <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curPage - 1}</span>
            </button>
            `
        }
        //Other page
        if(curPage < numPages ) {
            return `
            <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${curPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
            <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curPage - 1}</span>
            </button>
            `
        }
        //Page 2, and there are NO other pages
        return ''
    }
}

export default new PaginationView();