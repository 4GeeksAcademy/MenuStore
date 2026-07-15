export const initialStore = () => ({
  user: null,
  cartItems: [],
  favorites: [],
  clients: [],
});

export default function storeReducer(store, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case "SET_USER":
      return {
        ...store,
        user: payload,
      };

    case "UPDATE_USER":
      return {
        ...store,
        user: {
          ...store.user,
          ...payload,
        },
      };

    case "USER_IMAGE":
      return {
        ...store,
        user: {
          ...store.user,
          image: payload,
        },
      };

    case "SET_CART_ITEMS":
      return {
        ...store,
        cartItems: Array.isArray(payload)
          ? payload
          : [],
      };

    case "ADD_CART_ITEM":
      return {
        ...store,
        cartItems: [...store.cartItems, payload],
      };

    case "UPDATE_CART_ITEM_QUANTITY":
      return {
        ...store,
        cartItems: store.cartItems.map((item) =>
          item.product.id === payload.productId
            ? {
                ...item,
                quantity: payload.quantity,
              }
            : item
        ),
      };

    case "REMOVE_CART_ITEM":
      return {
        ...store,
        cartItems: store.cartItems.filter(
          (item) =>
            item.product.id !== payload
        ),
      };

    case "CLEAR_CART":
      return {
        ...store,
        cartItems: [],
      };

    case "SET_FAVORITES":
      return {
        ...store,
        favorites: Array.isArray(payload)
          ? payload
          : [],
      };

    case "ADD_FAVORITE":
      return {
        ...store,
        favorites: [...store.favorites, payload],
      };

    case "REMOVE_FAVORITE":
      return {
        ...store,
        favorites: store.favorites.filter(
          (favorite) =>
            favorite.product_id !== payload
        ),
      };

    case "LOGOUT":
      return {
        ...initialStore(),
      };

    default:
      return store;
  }
}