import {API_URL, RES_PER_PAGE, KEY} from "./config"
import {getJSON, sendJSON} from "./helper"

//state: lưu trữ dữ liệu của application
export const state = {
    recipe: {},
    search: {
        query: '',
        result: [],
        page: 1,
        resultPerPage: RES_PER_PAGE
    },
    bookmark: []
}

const createRecipeObject = function(data) {
    const recipe = data.data.recipe;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && {key: recipe.key}) //Nếu recipe.key có tồn tại thì destructuring {key: recipe.key}. Nếu recipe.key không tồn tại thì destructuring không ra gì cả (trống)
    };
}


export const loadRecipe = async function(id) {
    try {
        // getJSON là 1 async function nên getJSON return ra 1 promise. 
        // Sau khi await Promise thì const data sẽ bằng những gì mà getJSON return từ trong hàm getJSON ra. Nếu hàm getJSON thiếu return thì sẽ là undefined
        // Dù cho await getJSON(`${API_URL}/${id}`); có lấy dữ liệu thất bại thì cũng không lọt vào catch trong hàm loadRecipe. 
        // Vì khi lấy dữ liệu thất bại thì sẽ được catch trong hàm  getJSON. Và hàm getJSON sẽ return ra undefined ==> const data = undefined ==> không lọt vào catch trong hàm loadRecipe vì getJSON trả ra dữ liệu là undefined
        // Muốn catch được lỗi từ hàm getJSON ==> catch trong hàm getJSON phải throw error để catch trong hàm loadRecipe bắt được
        const data = await getJSON(`${API_URL}${id}?key=${KEY}`); 
        state.recipe = createRecipeObject(data);
        
        if(state.bookmark.some(bookmark => bookmark.id === id)){
            state.recipe.bookmark = true;
        } else {
            state.recipe.bookmark = false;
        }

    } catch (error) {
        //console.log(error);
        //throw error để catch trong hàm controlRecipes bên controller.js có thể bắt được lỗi và hiển thị
        throw error
    }
}

export const loadSearchResults = async function(query) {
    try {
        state.search.query = query;
        const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);

        state.search.result = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && {key: rec.key})
            }
        });
        state.search.page = 1;
    } catch (error) {
        throw error
    }
}

export const getSearchResultPage = function(page = 1) { // value default của page = 1
    state.search.page = page;
    const start = (page - 1) * state.search.resultPerPage;
    const end = page * state.search.resultPerPage;
    return state.search.result.slice(start, end);
}


export const updateServing = function(newServing) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * newServing / state.recipe.servings;
        //new quantity = old quantity * new serving / old serving --> 2 * 8 / 4 = 4
    });

    state.recipe.servings = newServing;
}

const persistBookmark = function() {
    //JSON.stringify: conver js --> JSON
    localStorage.setItem('bookmark', JSON.stringify(state.bookmark))
}


export const addBookMark = function(recipe) {
    //add bookmark
    state.bookmark.push(recipe);

    //mark current recipe as bookmark
    if(recipe.id  === state.recipe.id) {
        state.recipe.bookmark = true;
    };

    persistBookmark();  
}

export const deleteBookMark = function(id) {
    //delete bookmark
    const index = state.bookmark.findIndex(el => el.id === id)
    state.bookmark.splice(index, 1);

    //mark current recipe as NOT bookmark
    if(id  === state.recipe.id) {
        state.recipe.bookmark = false;
    }

    persistBookmark();
}

const init = function() {
    const storage = localStorage.getItem('bookmark');
    //JSON.parse: conver JSON --> js
    if(storage) state.bookmark = JSON.parse(storage);
}
init();


const clearBookmark = function() {
    localStorage.clear('bookmark');
}
// clearBookmark();

export const uploadRecipe = async function(newRecipe) {
    //console.log(newRecipe); //{title: 'TEST', sourceUrl: 'TEST', image: 'TEST', publisher: 'TEST', cookingTime: '23', …}
    //console.log(Object.entries(newRecipe)); //(12) [Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2)] || 0: ['title', 'TEST'] , ...

    //Object.entries convert object to array || 
    //Object.fromEntries convert array to object
    try {
        const ingredients = Object.entries(newRecipe)
            .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
            .map(ing => {
                const ingArr = ing[1].split(',').map(el => el.trim());
                if(ingArr.length !== 3) throw new Error('Wrong ingredient format. Please use correct format!');
                const [quantity, unit, description] = ingArr;
                return {quantity : quantity ? Number(quantity) : null, unit, description}
                //quantity : quantity ? Number(quantity) : null
                //unit: unit
                //description: description
            })
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: Number(newRecipe.cookingTime),
            servings: Number(newRecipe.servings),
            ingredients: ingredients,
        };
        
        const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        addBookMark(state.recipe)
    } catch (error) {
        //throw error để catch bên hàm controlAddRecipe (controller.js) bắt được và hiển thị 
        throw error
    }
    
    
}