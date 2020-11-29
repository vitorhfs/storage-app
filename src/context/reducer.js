export const initialState = {
  products: [],
  searchResult: '',
};

const reducer = (state, action) => {
  switch(action.type) {
    case 'SET_PRODUCT':
      return {
        ...state,
        products: action.payload,
      };
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [...state.products, action.payload],
      };
    case 'REMOVE_PRODUCT':
      return {
        ...state,
        products: state.products.filter((product) => {
          return product.id !== action.payload.id;
        })
      }
    case 'SET_SEARCH':
      return {
        ...state,
        searchResult: action.payload
      }
    default: 
      return state;
  }
}

export default reducer;