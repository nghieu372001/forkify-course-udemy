import icons from 'url:../../img/icons.svg' //import file img/icons.svg

export default class View {
    _data;
    //constructor() trống có thể bỏ

    /**
     * Render the receive object to the DOM
     * @param {Object | Object[]} data The data to be rendered (e.g recipe)
     * @param {*} render [render = true] If false create markup string instead of rendering to the DOM
     * @returns 
     */
    render(data, render = true) {
        //kiểm tra có data hay không
        if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError()
        
        this._data = data;
        const markup = this._generateMarkup();
        if(!render) return markup
        this._clear();
        this._parenElement.insertAdjacentHTML('afterbegin', markup); // insertAdjacentHTML:thêm element bằng chuỗi html 
    }

    update(data) {
        this._data = data;
        const newMarkup = this._generateMarkup();
        //document.createRange().createContextualFragment(newMarkup) --> tạo ra 1 DOM chứa các thẻ (tag0) từ chuỗi newMarkup --> console.log để quan sát
        const newDOM = document.createRange().createContextualFragment(newMarkup); 
        const newElement = Array.from(newDOM.querySelectorAll('*')); //--> select tất cả các thẻ có trong DOm vừa tạo --> dạng NodeList || Array.from từ NodeList chuyển thành dạng mảng
        const curElement = Array.from(this._parenElement.querySelectorAll('*')); //--> select tất cả các thẻ có trong DOM this._parenElement || Array.from từ NodeList chuyển thành dạng mảng

        newElement.forEach((newEl, i) => {
            const curEl = curElement[i];
            //console.log(curRl, newEl.isEqualNode(curEl)); //isEqualNode sẽ so sánh nội dung của newEl và curRl
            //Update change text
            if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {//isEqualNode sẽ so sánh nội dung của newEl và curRl || tìm hiều về  nodeValue
                curEl.textContent = newEl.textContent
            } 

            //Update changed attribute 
            if(!newEl.isEqualNode(curEl)) {
                //console.log(Array.from(newEl.attributes));
                Array.from(newEl.attributes).forEach(attr => {
                    curEl.setAttribute(attr.name, attr.value)
                })
            }   
        });

    }

    _clear() {
        this._parenElement.innerHTML= ''; //innerHTML: ghi đè nội dung trong tag
    }

    renderSpinder() {
        const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
        `;
        this._clear();
        this._parenElement.insertAdjacentHTML('afterbegin', markup)
    }

    renderError(message = this._errorMessge) { //message có default value = this._errorMessge
        const markup = `
        <div class="error">
            <div>
                <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                </svg>
            </div>
            <p>${message}</p>
        </div>
        `;
        this._clear();
        this._parenElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderMessage(message = this._message) { //message có default value = this._message
        const markup = `
        <div class="message">
            <div>
                <svg>
                    <use href="${icons}#icon-smile"></use>
                </svg>
            </div>
            <p>${message}</p>
        </div>
        `;
        this._clear();
        this._parenElement.insertAdjacentHTML('afterbegin', markup);
    }
}
