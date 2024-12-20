const initialState = {
    orderLength: 0, // Initialize with 0, as the default length
  };
  
  const orderReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SAVE_ORDER_LENGTH':
        return {
          ...state,
          orderLength: action.payload, // Save the order length
        };
      default:
        return state;
    }
  };
  
  export default orderReducer;