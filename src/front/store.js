export const initialStore = () => ({
  cartItems: [
    {
      id: 1,
      imgUrl: 'https://placehold.co/120x90',
      name: 'Hamburguesa',
      price: 9.99,
      details: 'Hamburguesa con queso, lechuga, tomate y cebolla. Servida con papas fritas.'
    },
    {
      id: 2,
      imgUrl: 'https://placehold.co/120x90',
      name: 'Pizza',
      price: 12.99,
      details: 'Pizza de pepperoni con extra de queso. Masa delgada y crujiente.'
    },
    {
      id: 3,
      imgUrl: 'https://placehold.co/120x90',
      name: 'Ensalada',
      price: 7.99,
      details: 'Ensalada fresca con lechuga, tomate, pepino y aderezo de vinagreta.'
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
