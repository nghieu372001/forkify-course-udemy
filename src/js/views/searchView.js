class SearchView {
    _parentEl = document.querySelector('.search');
    //constructor() trống có thể bỏ

    getQuery() {
        const query = this._parentEl.querySelector('.search__field').value;
        this._clearInput(); 
        return query;
    }

    _clearInput() {
        this._parentEl.querySelector('.search__field').value = '';
    }

    //lưu ý: (có thể thực thi được hàm handler vì closures). Các phương thức và biến trong handler có thể ghi nhớ và truy cập được các phương thức và biến đã tồn tại từ parent scope chúa nó (ở đây là glonbal scope của controller.js ). 
    //Nên hàm handler có thể truy cập đến các hàm như model.loadSearchResults, ...
    addHandlerSearch(handler) {
        this._parentEl.addEventListener('submit', function(e){
            e.preventDefault(); //ngăn chặn hành vị mặc định submit của form
            handler();
        })
    }
}

export default new SearchView();