function reducer(state, action) {
  switch (action.type) {
    case "GROUPS":
      return {
        ...state,
        groups: action.payload,
      };
    case "PRICES":
      return {
        ...state,
        prices: action.payload,
        loadingPrices: false,
      };
    case "ATTRIBUTES":
      return {
        ...state,
        attributes: action.payload,
        loadingAttributes: false,
      };

    default:
      return state;
  }
}

export default reducer;
