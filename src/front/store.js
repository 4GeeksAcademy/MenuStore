export const initialStore = () => ({
  user: {
    image: ""
  }
  ,
  cartItems: [
    
  ],
  favorites: [],
  clients: []
})

export default function storeReducer(store, action = {}) {
  const {type, payload}
  switch(type){
    case 'USER_IMAGE':
      return {
        ...store,
        user: {
          ...store.user,
          image: payload
        }
      };
    
    default:
      return store
  }    
}
