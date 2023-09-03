//lưu ý file controller.js là entry point vì trong index.html (<script defer type="module" src="src/js/controller.js"></script>) và trong package-lock.json ("start": "parcel index.html")
//file model.js sẽ tương tác với state
//file view sẽ render ra dữ liệu ngoài màn hình
//file controller sẽ xử lý những logic, kết nối model và view 

//import từ thư viện npm thì không cần đường dẫn
//import core-js và regenerator-runtime để đảm bảo rằng các website cũ có thể hoạt động được nhờ parcel
import 'core-js/actual'
import "regenerator-runtime/runtime.js"

import {MODAL_CLOSE_SEC} from './config'
import * as model from './model'
import recipeView from './views/recipeView'
import searchView from './views/searchView'
import resultView from './views/resultView'
import paginationView from './views/paginationView'
import bookmarkView from './views/bookmarkView'
import addRecipeView from './views/addRecipeView'



const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const controlRecipes = async function() {
  try {
    //window.location.hash: lấy từ thuộc tính href của thẻ a
    //http://localhost:1234/#5ed6604591c37cdc054bcb37 ==> hash = #5ed6604591c37cdc054bcb37
    const id = window.location.hash.slice(1);

    if(!id) return;
    //Loading image message
    recipeView.renderSpinder(recipeContainer);

    //0 Update results view to mark selected search result
    resultView.update(model.getSearchResultPage());

    //3 Updating bookmark view
    bookmarkView.update(model.state.bookmark);
    
    //1 Loading recipe
    //catch trong hàm model.loadRecipe cần phải throw error thể catch trong hàm controlRecipes có thể bắt được lỗi từ model.loadRecipe (đọc hàm loadRecipe - tương tự)
    await model.loadRecipe(id); //thêm dữ liệu vào state.recipe (bên mode.js)
    
    //2 Rendering recipe
    recipeView.render(model.state.recipe);

  } catch (error) {
    //console.log(error);
    //recipeView.renderError(`${error}`) 
    recipeView.renderError();
  }
};

const controlSearchResults = async function() {
  try { 
    resultView.renderSpinder();

    //1 Get search  query
    const query = searchView.getQuery();
    //console.log(query); //pizza

    //2 Load search results
    if(!query) return;
    await model.loadSearchResults(query); // thêm dữ liệu vào state.recipe (bên mode.js)

    //3 Rendering result 
    //model.getSearchResultPage() sẽ return ra số lượng bản ghi (dữ liệu)
    resultView.render(model.getSearchResultPage()); //.render kế thừa từ class View trong (view.js)

    //4 Render initial pagination button
    paginationView.render(model.state.search);
    

  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function(goToPage) {
  //1 Render New result
  resultView.render(model.getSearchResultPage(goToPage)); 
  //2 Render New oagination
  paginationView.render(model.state.search);
};

const controlServings = function(newServing) {
    //Update the recipe servings in state
    model.updateServing(newServing);
    //Update the recipe in view
    recipeView.update(model.state.recipe);
};


const controlAddBookMark = function() {
  //1 Add/ remove bookmark
  if(!model.state.recipe.bookmark) {
    //Add bookmark
    model.addBookMark(model.state.recipe)
  }
  else{
    //Delete bookmark
    model.deleteBookMark(model.state.recipe.id);
  } 
  //2 Update recipe view
  recipeView.update(model.state.recipe)

  //3 Render bookmark
  bookmarkView.render(model.state.bookmark);
}

const controlBookmark = function() {
  bookmarkView.render(model.state.bookmark)
}

const controlAddRecipe = async function(newRecipe) {
  try {
    // Show loading spiner
    addRecipeView.renderSpinder();

    //Upload new recipe data
    await model.uploadRecipe(newRecipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Success Message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarkView.render(model.state.bookmark);

    //Change ID in Url
    //window.history.pushState nhận 3 tham số || tham số thứ 3 quan trọng nhất || chuyển url đến url được chỉ định ==> #${model.state.recipe.id}
    //id ở chính là recipe vừa mới tạo
    window.history.pushState(null, '', `#${model.state.recipe.id}`)
    //window.history.back() //quay về đường dẫn (url) trước đó

    //Close form window
    setTimeout(function(){
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000)
  } catch (error) {
    // console.log(error);
    addRecipeView.renderError(error.message)
  }
}

//Ban đầu lọt vào đây
const init = function() {
  bookmarkView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServing(controlServings);
  recipeView.addHandlerAddBookMark(controlAddBookMark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHanlderClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();


