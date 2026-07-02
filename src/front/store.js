export const initialStore = () => ({
  cartItems: [
    {
      id: 1,
      name: 'Hamburguesa',
      price: 9.99,
      quantity: 1,
      image: 'https://placehold.co/120x90'
    },
    {
      id: 2,
      name: 'Pizza',
      price: 12.99,
      quantity: 1,
      image: 'https://placehold.co/120x90'
    },
    {
      id: 3,
      name: 'Ensalada',
      price: 7.99,
      quantity: 1,
      image: 'https://placehold.co/120x90'
    }
  ],
  favorites: [],
  clients: []
})

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };
      
    case 'add_task':

      const { id,  color } = action.payload

      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };
    default:
      throw Error('Unknown action.');
  }    
}
