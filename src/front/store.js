export const initialStore = () => ({
  user: {
    id: null,
    name: null,
    email: null,
    image: null
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
      
    case 'LOAD_USER':

      const { id,  color } = payload

      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };
    default:
      return store;
  }    
}
