import View from "./view"
import previewView from "./previewView"


class BookmarkView extends View {
    _parenElement = document.querySelector('.bookmarks__list');
    _errorMessge = 'No bookmark yet. Find a nice recipe and bookmark it!';
    _message = '';

    addHandlerRender(handler){
        window.addEventListener('load', handler)
    }

    _generateMarkup() {
        return this._data.map(bookmark => previewView.render(bookmark, false)).join('');
    }
}

export default new BookmarkView();