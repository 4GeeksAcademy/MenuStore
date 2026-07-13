
const urlApi = "https://animated-memory-5g4qw67xgjjrh44xp-3001.app.github.dev/api"

export const fetchRegister = async (userData) => {
        try{    
            const response = await fetch(`${urlApi}/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            const data = await response.json();
            console.log('Registro exitoso:', data);
            return data;
            


        } catch (error) {
            console.error('Error al registrar usuario:', error);
            throw error;
        }
    };

export const fetchLogin = async (userData) => {
    try {
        const response = await fetch(`${urlApi}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        const data = await response.json();
        console.log('Inicio de sesión exitoso:', data);
        return data;

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        throw error;
    }
}

// TIENDA

export const fetchStore = async () => {
  try {
    const response = await fetch(`${urlApi}/store`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        data.message ||
        "Error al obtener la tienda"
      );
    }

    return data;
  } catch (error) {
    console.error("Error al obtener la tienda:", error);
    throw error;
  }
};


export const fetchUpdateStore = async (storeData) => {
  try {
    const response = await fetch(`${urlApi}/store`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(storeData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Error al actualizar la tienda"
      );
    }

    return data;
  } catch (error) {
    console.error("Error al actualizar la tienda:", error);
    throw error;
  }
};

// CATEGORÍAS

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${urlApi}/categories`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Error al obtener las categorías"
      );
    }

    return data;
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    throw error;
  }
};


export const fetchCreateCategory = async (categoryData) => {
  try {
    const response = await fetch(`${urlApi}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(categoryData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Error al crear la categoría"
      );
    }

    return data;
  } catch (error) {
    console.error("Error al crear la categoría:", error);
    throw error;
  }
};


export const fetchDeleteCategory = async (categoryId) => {
  try {
    const response = await fetch(
      `${urlApi}/categories/${categoryId}`,
      {
        method: "DELETE"
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Error al eliminar la categoría"
      );
    }

    return data;
  } catch (error) {
    console.error("Error al eliminar la categoría:", error);
    throw error;
  }
};

// PRODUCTOS

export const fetchProductsByCategory = async (categoryId) => {
  try {
    const response = await fetch(
      `${urlApi}/products/category/${categoryId}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Error al obtener los productos"
      );
    }

    return data;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    throw error;
  }
};


export const fetchCreateProduct = async (productData) => {
  try {
    const response = await fetch(`${urlApi}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(productData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Error al crear el producto"
      );
    }

    return data;
  } catch (error) {
    console.error("Error al crear el producto:", error);
    throw error;
  }
};


export const fetchUpdateProduct = async (
  productId,
  productData
) => {
  try {
    const response = await fetch(
      `${urlApi}/products/${productId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(productData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Error al actualizar el producto"
      );
    }

    return data;
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    throw error;
  }
};


export const fetchDeleteProduct = async (productId) => {
  try {
    const response = await fetch(
      `${urlApi}/products/${productId}`,
      {
        method: "DELETE"
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Error al eliminar el producto"
      );
    }

    return data;
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    throw error;
  }
};