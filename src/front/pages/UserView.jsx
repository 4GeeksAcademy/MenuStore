import React, { useEffect, useState } from 'react';
import { fetchUploadImage, fetchUserProfile } from "../fetch.js";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link, useNavigate } from 'react-router-dom';


const UserView = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedRole, setSelectedRole] = useState("User");
    const [inputValues, setInputValues] = useState({
        username: "",
        email: "",

    });

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const uploadImage = async () => {
        if (!selectedFile) {
            alert('Por favor, selecciona una imagen antes de subirla.');
            return;
        }

        try {
            const image = await fetchUploadImage(selectedFile)

            console.log('Imagen subida exitosamente:', image);
            dispatch({ type: 'USER_IMAGE', payload: image });

            alert('Imagen subida correctamente');
        } catch (error) {
            console.error('Error al subir la imagen:', error);
            throw error;
        }


    }

    useEffect(() => {
        const loadData = async () => {
            try {

                const userData = await fetchUserProfile();
                setUser(userData.user);

                setInputValues({
                    username: userData.user?.name || "",
                    email: userData.user?.email || ""
                });
            } catch (error) {

                console.log("No se pudo cargar el perfil:", error.message);
                localStorage.removeItem("token");
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [navigate])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputValues({
            ...inputValues,
            [name]: value
        });
    };

    if (loading) return <div>Cargando datos...</div>;
    if (!user) return <div>No se pudo cargar la información del usuario.</div>;

    return (
        <div className="container">
            <div className="card text-center shadow-sm">
                <div className="card-header fw-bold text-secondary">
                    User Profile View
                </div>

                <div className="card-body">
                    <div className="row border-bottom py-4 mb-4 justify-content-between align-items-center">
                        <div className="col-auto">

                            {store.user.image && (
                                <img src={store.user.image} alt="User Avatar" className="img-thumbnail" />
                            )}

                            <div className="input-group">
                                {!selectedFile && <>
                                    <input
                                        type="file"
                                        multiple={false}
                                        accept="image/*"
                                        className="d-none"
                                        id="inputGroupFile02"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="inputGroupFile02" className="btn btn-outline-primary border-3">
                                        Subir una imagen
                                    </label>
                                </>}

                                {selectedFile && (
                                    <div className="d-flex align-items-center">
                                        <img src={URL.createObjectURL(selectedFile)} alt="Selected"
                                            className="img-thumbnail object-fit-cover me-2"
                                            style={{ width: '100px', height: '100px' }}
                                        />
                                        <span>{selectedFile.name}</span>
                                        <button
                                            className="btn btn-danger ms-3"
                                            onClick={() => setSelectedFile(null)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-auto">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    if (selectedFile) {
                                        alert('Subiendo imagen:', selectedFile);
                                        uploadImage()
                                    }
                                }}
                            >
                                Edit Avatar
                            </button>
                        </div>
                    </div>

                    <div className="row border-bottom py-4 mb-4 justify-content-between align-items-center">
                        <div className="col-auto">
                            <input
                                type="text"
                                className="form-control"
                                name="username"
                                value={inputValues.username}
                                onChange={handleInputChange}
                                placeholder="Full Name"
                            />
                        </div>
                        <div className="col-auto">
                            <button type="button" className="btn btn-secondary">Save Name</button>
                        </div>
                    </div>

                    <div className="row border-bottom py-4 mb-4 justify-content-between align-items-center">
                        <div className="col-auto">
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={inputValues.email}
                                onChange={handleInputChange}
                                placeholder="Email Address"
                            />
                        </div>
                        <div className="col-auto">
                            <button type="button" className="btn btn-secondary">Update Email</button>
                        </div>
                    </div>

                    <div className="row border-bottom py-4 mb-4 justify-content-between align-items-center">
                        <div className="col-auto">
                            <div className="dropdown">
                                <button
                                    className="btn btn-primary dropdown-toggle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {selectedRole}
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <button
                                            className="dropdown-item"
                                            type="button"
                                            onClick={() => setSelectedRole('User')}
                                        >
                                            User
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className="dropdown-item"
                                            type="button"
                                            onClick={() => setSelectedRole('Admin')}
                                        >
                                            Admin
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-auto">
                            <button type="button" className="btn btn-secondary">Change Role</button>
                        </div>
                    </div>

                    <div className="row py-4 justify-content-between align-items-center">
                        <div className="col-auto">
                            <button type="button" className="btn btn-primary">Security Settings</button>
                        </div>
                        <div className="col-auto">
                            <button type="button" className="btn btn-secondary">Edit Password</button>
                        </div>
                    </div>
                </div>

                <div className="card-footer text-body-secondary d-flex justify-content-center py-4">
                    <Link to="/" type="button" className="btn btn-secondary px-5 py-3">
                        Back
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default UserView