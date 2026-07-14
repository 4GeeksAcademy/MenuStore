import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ShopAdminView = () => {
  const navigate = useNavigate();
  const urlApi = `${import.meta.env.VITE_BACKEND_URL}/api`;

  const [shopName, setShopName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [shopLogo, setShopLogo] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    getStore();
    getCategories();
  }, []);

  const getStore = async () => {
    try {
      const response = await fetch(`${urlApi}/store`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Error al obtener la tienda"
        );
      }

      setShopName(data.name || "");
      setShopLogo(data.logo || "");
    } catch (error) {
      console.error("Error al cargar la tienda:", error);
      alert(error.message || "No se pudo cargar la tienda");
    }
  };

  const getCategories = async () => {
    try {
      const response = await fetch(`${urlApi}/categories`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Error al obtener las categorías"
        );
      }

      setCategories(data);

      if (data.length > 0) {
        setSelectedCategoryId(data[0].id);
      } else {
        setSelectedCategoryId("");
      }
    } catch (error) {
      console.error("Error al cargar las categorías:", error);
      alert(error.message || "No se pudieron cargar las categorías");
    }
  };

  const uploadShopLogo = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploadingImage(true);

      const imageUrl = await fetchUploadImage(file);

      const updatedStore = await fetchUpdateStore({
        logo: imageUrl
      });

      setShopLogo(updatedStore.logo || imageUrl);

      alert("Logo actualizado correctamente");
    } catch (error) {
      console.error("Error al subir el logo:", error);

      alert(
        error.message ||
        "No se pudo subir el logo"
      );
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  const saveShopName = async () => {
    if (!shopName.trim()) {
      alert("Escribe el nombre de la tienda");
      return;
    }

    try {
      const response = await fetch(`${urlApi}/store`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: shopName.trim() })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar la tienda");
      }

      setShopName(data.name || shopName);

      alert("Nombre guardado correctamente");
    } catch (error) {
      console.error("Error al guardar el nombre:", error);
      alert(error.message || "No se pudo guardar el nombre");
    }
  };

  const addCategory = async () => {
    if (!categoryName.trim()) {
      alert("Escribe una categoría");
      return;
    }

    try {
      const response = await fetch(`${urlApi}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: categoryName.trim().toLowerCase()
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear la categoría");
      }

      setCategories([...categories, data]);
      setSelectedCategoryId(data.id);
      setCategoryName("");

      alert("Categoría agregada correctamente");
    } catch (error) {
      console.error("Error al crear la categoría:", error);
      alert(error.message || "No se pudo crear la categoría");
    }
  };

  const deleteCategory = async () => {
    if (!selectedCategoryId) {
      alert("Selecciona una categoría");
      return;
    }

    try {
      const response = await fetch(`${urlApi}/categories/${selectedCategoryId}`, {
        method: "DELETE"
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al eliminar la categoría");
      }

      const updatedCategories = categories.filter(
        (category) =>
          category.id !== Number(selectedCategoryId)
      );

      setCategories(updatedCategories);

      if (updatedCategories.length > 0) {
        setSelectedCategoryId(updatedCategories[0].id);
      } else {
        setSelectedCategoryId("");
      }

      alert("Categoría eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
      alert(error.message || "No se pudo eliminar la categoría");
    }
  };

  const goBack = () => {
    navigate("/");
  };

  return (
    <div className="bg-light min-vh-100">
      <nav className="navbar navbar-dark bg-dark shadow-sm px-4 justify-content-between">
        <h5 className="text-white m-0">
          Admin Panel
        </h5>

        <button
          className="btn btn-outline-light"
          onClick={goBack}
        >
          Ir a tienda
        </button>
      </nav>

      <div className="container bg-white shadow rounded my-4 p-0">
        <div className="text-center py-5 px-3">
          <img
            src={
              shopLogo ||
              "https://placehold.co/200x150?text=Store"
            }
            className="img-fluid rounded-4 shadow-sm mb-3"
            alt="Store storefront"
            style={{
              width: "190px",
              height: "150px",
              objectFit: "cover"
            }}
          />

          <h1 className="fw-bold">
            Store Management
          </h1>

          <p className="text-muted mb-0">
            Administra la información principal de tu negocio.
          </p>
        </div>

        <div className="p-4">
          <div className="row align-items-center border rounded-4 shadow-sm mb-4 p-3 bg-white">
            <div className="col-md-8">
              <span className="badge bg-warning text-dark mb-2">
                Imagen
              </span>

              <h5 className="fw-bold mb-2">
                Imagen principal
              </h5>

              <p className="text-muted mb-0">
                Esta será la imagen visible para los clientes.
              </p>
            </div>

            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <input
                type="file"
                accept="image/*"
                id="shop-logo-input"
                className="d-none"
                onChange={uploadShopLogo}
              />

              <label
                htmlFor="shop-logo-input"
                className={`btn btn-primary rounded-pill px-4 ${uploadingImage ? "disabled" : ""
                  }`}
              >
                {uploadingImage ? "Subiendo..." : "Edit Image"}
              </label>
            </div>
          </div>

          <div className="row align-items-center border rounded-4 shadow-sm mb-4 p-3 bg-white">
            <div className="col-md-8">
              <span className="badge bg-primary mb-2">
                Nombre
              </span>

              <h5 className="fw-bold mb-2">
                Nombre de la tienda
              </h5>

              <input
                type="text"
                className="form-control"
                placeholder="Name Shop"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
              />
            </div>

            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <button
                type="button"
                className="btn btn-primary rounded-pill px-4"
                onClick={saveShopName}
              >
                Save Name
              </button>
            </div>
          </div>

          <div className="row align-items-center border rounded-4 shadow-sm mb-4 p-3 bg-white">
            <div className="col-md-8">
              <span className="badge bg-success mb-2">
                Categorías
              </span>

              <h5 className="fw-bold mb-2">
                Administrar categorías
              </h5>

              <div className="d-flex flex-wrap gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="New category"
                  value={categoryName}
                  onChange={(e) =>
                    setCategoryName(e.target.value)
                  }
                  style={{ maxWidth: "220px" }}
                />

                <select
                  className="form-select"
                  value={selectedCategoryId}
                  onChange={(e) =>
                    setSelectedCategoryId(e.target.value)
                  }
                  style={{ maxWidth: "240px" }}
                >
                  <option value="">
                    Selecciona una categoría
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-md-4 text-md-end mt-3 mt-md-0 d-flex justify-content-md-end gap-2">
              <button
                type="button"
                className="btn btn-primary rounded-pill px-4"
                onClick={addCategory}
              >
                Añadir
              </button>

              <button
                type="button"
                className="btn btn-danger rounded-pill px-4"
                onClick={deleteCategory}
              >
                Eliminar
              </button>
            </div>
          </div>

          <div className="row align-items-center border rounded-4 shadow-sm mb-4 p-3 bg-white">
            <div className="col-md-8">
              <span className="badge bg-dark mb-2">
                Productos
              </span>

              <h5 className="fw-bold mb-2">
                Productos y servicios
              </h5>

              <p className="text-muted mb-0">
                Agrega, edita o elimina productos de la categoría seleccionada.
              </p>
            </div>

            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <Link
                to={
                  selectedCategoryId
                    ? `/product-manager/${selectedCategoryId}`
                    : "#"
                }
                className="btn btn-primary rounded-pill px-4"
                onClick={(e) => {
                  if (!selectedCategoryId) {
                    e.preventDefault();
                    alert("Selecciona una categoría primero");
                  }
                }}
              >
                Edit Products
              </Link>
            </div>
          </div>
        </div>

        <footer className="bg-dark text-white text-center py-3 rounded-bottom">
          <small>
            Panel administrativo - MenuStore
          </small>
        </footer>
      </div>
    </div>
  );
};

export default ShopAdminView;