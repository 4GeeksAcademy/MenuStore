export const initialStore = () => ({
  user: {
    id: "",
    name: "",
    email: "",
    image: ""
  },
  cartItems: [
    
  ],
  favorites: [],
  clients: []
})

export default function storeReducer(store, action = {}) {

  const { type, payload } = action;
  
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
      return store;
  }    
}
