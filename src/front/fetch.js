// const urlApi = "https://animated-memory-5g4qw67xgjjrh44xp-3001.app.github.dev/api" //

const urlApi = `${import.meta.env.VITE_BACKEND_URL}/api`; // debido a falla al momento de ejecutar funciones de admin shop me sugirio esta urlAPI

export const fetchRegister = async (userData) => {
  try {
    const response = await fetch(`${urlApi}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    const data = await response.json();
    console.log("Registro exitoso:", data);
    return data;
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    throw error;
  }
};

export const fetchUserProfile = async (userId) => {
  try {
    const response = await fetch(`${urlApi}/user/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.msg || "Error al obtener el perfil");
    }

    return data;
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    throw error;
  }
};

export const fetchLogin = async (userData) => {
  try {
    const response = await fetch(`${urlApi}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    const data = await response.json();
    console.log("Inicio de sesión exitoso:", data);
    return data;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

// TIENDA

export const fetchStore = async () => {
  try {
    const response = await fetch(`${urlApi}/store`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || data.message || "Error al obtener la tienda",
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
        "Content-Type": "application/json",
      },
      body: JSON.stringify(storeData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al actualizar la tienda");
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
      throw new Error(data.error || "Error al obtener las categorías");
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
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al crear la categoría");
    }

    return data;
  } catch (error) {
    console.error("Error al crear la categoría:", error);
    throw error;
  }
};

export const fetchDeleteCategory = async (categoryId) => {
  try {
    const response = await fetch(`${urlApi}/categories/${categoryId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al eliminar la categoría");
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
    const response = await fetch(`${urlApi}/products/category/${categoryId}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al obtener los productos");
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
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al crear el producto");
    }

    return data;
  } catch (error) {
    console.error("Error al crear el producto:", error);
    throw error;
  }
};

export const fetchUpdateProduct = async (productId, productData) => {
  try {
    const response = await fetch(`${urlApi}/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al actualizar el producto");
    }

    return data;
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    throw error;
  }
};

export const fetchDeleteProduct = async (productId) => {
  try {
    const response = await fetch(`${urlApi}/products/${productId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al eliminar el producto");
    }

    return data;
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    throw error;
  }
};

// FAVORITOS

export const fetchUserFavorites = async (userId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${urlApi}/favorites/user/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || data.msg || "Error al obtener los favoritos",
      );
    }

    return data;
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    throw error;
  }
};

export const fetchAddFavorite = async (userId, productId) => {
  try {
    const response = await fetch(`${urlApi}/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        user_id: userId,
        product_id: productId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al agregar el favorito");
    }

    return data;
  } catch (error) {
    console.error("Error al agregar favorito:", error);
    throw error;
  }
};

export const fetchDeleteFavorite = async (userId, productId) => {
  try {
    const response = await fetch(
      `${urlApi}/favorites/user/${userId}/product/${productId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al eliminar el favorito");
    }

    return data;
  } catch (error) {
    console.error("Error al eliminar favorito:", error);
    throw error;
  }
};

// CARRITO

export const fetchAddToCart = async (userId, productId) => {
  try {
    const response = await fetch(`${urlApi}/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        productId: productId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al agregar el producto al carrito");
    }

    return data;
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);

    throw error;
  }
};

export const fetchUserCart = async (userId) => {
  try {
    const response = await fetch(`${urlApi}/user/cart/${userId}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al obtener el carrito");
    }

    return data;
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    throw error;
  }
};

// CLOUDINARY

export const fetchUploadImage = async (file) => {
  try {
    if (!file) {
      throw new Error("No se seleccionó ninguna imagen");
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
    );

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "No se pudo subir la imagen");
    }

    return data.secure_url;
  } catch (error) {
    console.error("Error al subir imagen a Cloudinary:", error);
    throw error;
  }
};
