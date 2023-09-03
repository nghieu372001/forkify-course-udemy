import View from "./view"
import icons from 'url:../../img/icons.svg' //import file img/icons.svg

class AddRecipeView extends View {
    _parenElement = document.querySelector('.upload');
    _message = 'Recipe was successfully uploaded'
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose= document.querySelector('.btn--close-modal');

    constructor() {
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    }

    toggleWindow(){
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }

    _addHandlerShowWindow() {
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }

    _addHandlerHideWindow() {
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    }

    addHandlerUpload(handler) {
        this._parenElement.addEventListener('submit', function(e){
            //this = this._parenElement
            e.preventDefault();
            //Lấy dữ liệu từ form
            //new FormData(this) tạo ra object FormData {} ==> không sử dụng được ==> spread vào array để sử dụng
            const dataArr = [...new FormData(this)];
            const data = Object.fromEntries(dataArr) //Object.fromEntries biến array có dạng entries (entries là mảng các  thuộc tính và  giá trị (key) của object) ['title', 'TEST'] thành object {title: 'TEST'}
            handler(data)
        })
    }

    _generateMarkup() {
        
    }
}

export default new AddRecipeView();