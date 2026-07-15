import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  fetchUserProfile,
  fetchUpdateUser,
  fetchDeleteUser,
  fetchUploadImage,
} from "../fetch.js";

const UserView = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingName, setSavingName] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const savedUser = localStorage.getItem("user");

  let loggedUser = null;

  try {
    loggedUser = savedUser
      ? JSON.parse(savedUser)
      : null;
  } catch (error) {
    console.error(
      "Error al leer el usuario guardado:",
      error
    );

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  const userId = loggedUser?.id;

  const clearMessages = () => {
    setError("");
    setSuccessMessage("");
  };

  const updateStoredUser = (updatedUser) => {
    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
    setName(updatedUser?.name || "");
    setEmail(updatedUser?.email || "");
    setImagePreview(updatedUser?.image || "");
  };

  const loadUser = async () => {
    if (!userId) {
      setError(
        "Debes iniciar sesión para ver tu perfil"
      );
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await fetchUserProfile(userId);

      updateStoredUser(data);
    } catch (error) {
      console.error(
        "Error al cargar el perfil:",
        error
      );

      setError(
        error.message ||
          "No se pudo cargar la información del perfil"
      );

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleFileChange = (event) => {
    clearMessages();

    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError(
        "El archivo seleccionado debe ser una imagen"
      );
      return;
    }

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCancelImage = () => {
    setSelectedFile(null);
    setImagePreview(user?.image || "");
  };

  const handleUploadImage = async () => {
    if (!selectedFile) {
      setError("Selecciona una imagen primero");
      return;
    }

    try {
      setUploadingImage(true);
      clearMessages();

      const imageUrl =
        await fetchUploadImage(selectedFile);

      const updatedUser = await fetchUpdateUser(
        userId,
        {
          image: imageUrl,
        }
      );

      updateStoredUser(updatedUser);
      setSelectedFile(null);

      setSuccessMessage(
        "Imagen de perfil actualizada correctamente"
      );
    } catch (error) {
      console.error(
        "Error al actualizar la imagen:",
        error
      );

      setError(
        error.message ||
          "No se pudo actualizar la imagen"
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveName = async () => {
    if (!name.trim()) {
      setError(
        "El nombre no puede estar vacío"
      );
      return;
    }

    try {
      setSavingName(true);
      clearMessages();

      const updatedUser = await fetchUpdateUser(
        userId,
        {
          name: name.trim(),
        }
      );

      updateStoredUser(updatedUser);

      setSuccessMessage(
        "Nombre actualizado correctamente"
      );
    } catch (error) {
      console.error(
        "Error al actualizar el nombre:",
        error
      );

      setError(
        error.message ||
          "No se pudo actualizar el nombre"
      );
    } finally {
      setSavingName(false);
    }
  };

  const handleSaveEmail = async () => {
    if (!email.trim()) {
      setError(
        "El correo electrónico no puede estar vacío"
      );
      return;
    }

    try {
      setSavingEmail(true);
      clearMessages();

      const updatedUser = await fetchUpdateUser(
        userId,
        {
          email: email.trim().toLowerCase(),
        }
      );

      updateStoredUser(updatedUser);

      setSuccessMessage(
        "Correo actualizado correctamente"
      );
    } catch (error) {
      console.error(
        "Error al actualizar el correo:",
        error
      );

      setError(
        error.message ||
          "No se pudo actualizar el correo"
      );
    } finally {
      setSavingEmail(false);
    }
  };

  const handleSavePassword = async () => {
    if (!newPassword) {
      setError(
        "Escribe una contraseña nueva"
      );
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "La contraseña debe tener al menos 6 caracteres"
      );
      return;
    }

    try {
      setSavingPassword(true);
      clearMessages();

      await fetchUpdateUser(userId, {
        password: newPassword,
      });

      setNewPassword("");

      setSuccessMessage(
        "Contraseña actualizada correctamente"
      );
    } catch (error) {
      console.error(
        "Error al actualizar la contraseña:",
        error
      );

      setError(
        error.message ||
          "No se pudo actualizar la contraseña"
      );
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingAccount(true);
      clearMessages();

      await fetchDeleteUser(userId);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/register");
    } catch (error) {
      console.error(
        "Error al eliminar la cuenta:",
        error
      );

      setError(
        error.message ||
          "No se pudo eliminar la cuenta"
      );
    } finally {
      setDeletingAccount(false);
    }
  };

  // Mientras se cargan los datos del perfil
  if (loading) {
    return (
      <div className="ms-page d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div
            className="spinner-border"
            role="status"
            style={{
              color: "var(--ms-navy)",
              width: "3rem",
              height: "3rem",
            }}
          >
            <span className="visually-hidden">
              Cargando perfil...
            </span>
          </div>

          <p className="text-muted mt-3 mb-0">
            Cargando tu perfil...
          </p>
        </div>
      </div>
    );
  }

  // Si el usuario no pudo cargarse
  if (!user) {
    return (
      <div className="ms-page">
        <div className="container">
          <div
            className="ms-page-shell mx-auto"
            style={{ maxWidth: "650px" }}
          >
            <div className="ms-content-section text-center">
              <i
                className="fa-solid fa-circle-exclamation mb-3"
                style={{
                  color: "#b44343",
                  fontSize: "3rem",
                }}
              />

              <div className="alert alert-danger">
                {error ||
                  "No se pudo cargar el perfil"}
              </div>

              <Link
                to="/login"
                className="store-primary-button d-inline-block"
              >
                Ir al login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista principal del perfil
  return (
    <div className="ms-page">
      <div className="container">
        <div className="ms-page-shell">
          <section className="ms-profile-hero">
            <div className="row align-items-center">
              <div className="col-md-auto text-center mb-4 mb-md-0">
                <img
                  src={
                    imagePreview ||
                    user?.image ||
                    "https://placehold.co/160x160?text=Usuario"
                  }
                  alt="Avatar del usuario"
                  className="ms-profile-avatar"
                />
              </div>

              <div className="col-md text-center text-md-start">
                <h1 className="ms-profile-name mb-1">
                  {user?.name || "Usuario"}
                </h1>

                <p className="text-white-50 mb-3">
                  {user?.email ||
                    "Sin correo registrado"}
                </p>

                <span className="ms-profile-role text-capitalize">
                  {user?.role || "client"}
                </span>
              </div>

              <div className="col-md-auto text-center mt-4 mt-md-0">
                <Link
                  to="/orders"
                  className="btn btn-outline-light rounded-pill px-4"
                >
                  <i className="fa-solid fa-box me-2" />
                  Mis pedidos
                </Link>
              </div>
            </div>
          </section>

          <div className="ms-content-section">
            {error && (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                <i className="fa-solid fa-circle-exclamation me-2" />

                {error}

                <button
                  type="button"
                  className="btn-close"
                  aria-label="Cerrar"
                  onClick={() => setError("")}
                />
              </div>
            )}

            {successMessage && (
              <div
                className="alert alert-success alert-dismissible fade show"
                role="alert"
              >
                <i className="fa-solid fa-circle-check me-2" />

                {successMessage}

                <button
                  type="button"
                  className="btn-close"
                  aria-label="Cerrar"
                  onClick={() =>
                    setSuccessMessage("")
                  }
                />
              </div>
            )}

            <section className="ms-form-section">
              <h3 className="ms-form-section-title mb-3">
                Imagen de perfil
              </h3>

              <p className="text-muted">
                Selecciona una imagen para personalizar tu perfil.
              </p>

              <div className="row g-3 align-items-end">
                <div className="col-md-8">
                  <label
                    htmlFor="profile-image"
                    className="form-label"
                  >
                    Nueva imagen
                  </label>

                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="form-control ms-form-control"
                    onChange={handleFileChange}
                  />

                  {selectedFile && (
                    <small className="text-muted d-block mt-2">
                      Archivo seleccionado:{" "}
                      {selectedFile.name}
                    </small>
                  )}
                </div>

                <div className="col-md-4">
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="ms-save-button flex-grow-1"
                      onClick={handleUploadImage}
                      disabled={
                        !selectedFile ||
                        uploadingImage
                      }
                    >
                      {uploadingImage ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            aria-hidden="true"
                          />
                          Subiendo...
                        </>
                      ) : (
                        "Guardar imagen"
                      )}
                    </button>

                    {selectedFile && (
                      <button
                        type="button"
                        className="btn ms-secondary-button"
                        onClick={handleCancelImage}
                        disabled={uploadingImage}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="ms-form-section">
              <h3 className="ms-form-section-title mb-3">
                Información personal
              </h3>

              <div className="row g-4">
                <div className="col-md-8">
                  <label
                    htmlFor="profile-name"
                    className="form-label"
                  >
                    Nombre completo
                  </label>

                  <input
                    id="profile-name"
                    type="text"
                    className="form-control ms-form-control"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                  />
                </div>

                <div className="col-md-4 d-flex align-items-end">
                  <button
                    type="button"
                    className="ms-save-button w-100"
                    onClick={handleSaveName}
                    disabled={savingName}
                  >
                    {savingName ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        />
                        Guardando...
                      </>
                    ) : (
                      "Guardar nombre"
                    )}
                  </button>
                </div>

                <div className="col-md-8">
                  <label
                    htmlFor="profile-email"
                    className="form-label"
                  >
                    Correo electrónico
                  </label>

                  <input
                    id="profile-email"
                    type="email"
                    className="form-control ms-form-control"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                  />
                </div>

                <div className="col-md-4 d-flex align-items-end">
                  <button
                    type="button"
                    className="ms-save-button w-100"
                    onClick={handleSaveEmail}
                    disabled={savingEmail}
                  >
                    {savingEmail ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        />
                        Guardando...
                      </>
                    ) : (
                      "Guardar correo"
                    )}
                  </button>
                </div>
              </div>
            </section>

            <section className="ms-form-section">
              <h3 className="ms-form-section-title mb-3">
                Seguridad
              </h3>

              <div className="row g-3 align-items-end">
                <div className="col-md-8">
                  <label
                    htmlFor="profile-password"
                    className="form-label"
                  >
                    Nueva contraseña
                  </label>

                  <input
                    id="profile-password"
                    type="password"
                    className="form-control ms-form-control"
                    placeholder="Mínimo 6 caracteres"
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(
                        event.target.value
                      )
                    }
                  />
                </div>

                <div className="col-md-4">
                  <button
                    type="button"
                    className="ms-save-button w-100"
                    onClick={handleSavePassword}
                    disabled={savingPassword}
                  >
                    {savingPassword ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        />
                        Guardando...
                      </>
                    ) : (
                      "Cambiar contraseña"
                    )}
                  </button>
                </div>
              </div>
            </section>

            <section className="mb-4">
              <div className="border border-danger rounded-4 p-4 bg-danger-subtle">
                <h4 className="text-danger">
                  Zona peligrosa
                </h4>

                <p className="text-muted">
                  Esta acción elimina tu cuenta permanentemente y no puede deshacerse.
                </p>

                <button
                  type="button"
                  className="btn ms-danger-button"
                  onClick={handleDeleteAccount}
                  disabled={deletingAccount}
                >
                  {deletingAccount ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        aria-hidden="true"
                      />
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <i className="fa-regular fa-trash-can me-2" />
                      Eliminar cuenta
                    </>
                  )}
                </button>
              </div>
            </section>

            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link
                to="/"
                className="store-primary-button"
              >
                <i className="fa-solid fa-store me-2" />
                Volver a la tienda
              </Link>

              <Link
                to="/shopping-cart"
                className="btn ms-secondary-button"
              >
                <i className="fa-solid fa-cart-shopping me-2" />
                Ver carrito
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserView;