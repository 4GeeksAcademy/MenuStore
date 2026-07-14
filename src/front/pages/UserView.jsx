import React, { useState } from 'react';

import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

const UserView = () => {

    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedRole, setSelectedRole] = useState("User");
    const [inputValues, setInputValues] = useState({
        username: "",
        email: "",

    });
    const { store, dispatch } = useGlobalReducer();

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const uploadImage = async () => {

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append("upload_preset", "MenuStore")

        try {
            const response = await fetch("https://api.cloudinary.com/v1_1/dk0xwtjyr/image/upload", {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error al subir la imagen');
            }

            const data = await response.json();
            console.log('Imagen subida exitosamente:', data);
            dispatch({ type: 'USER_IMAGE', payload: data.secure_url });

        } catch (error) {
            console.error('Error al subir la imagen:', error);
            throw error;
        }

        alert('Imagen subida correctamente');

    }

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
                                    } else {
                                        alert('No se ha seleccionado ninguna imagen.');
                                    }
                                }}
                            >
                                Edit Avatar
                            </button>
                        </div>
                    </div>

                    <div className="row border-bottom py-4 mb-4 justify-content-between align-items-center">
                        <div className="col-auto">
                            <input type="text" className="form-control" placeholder="Full Name" defaultValue="John Doe" />
                        </div>
                        <div className="col-auto">
                            <button type="button" className="btn btn-secondary">Save Name</button>
                        </div>
                    </div>

                    <div className="row border-bottom py-4 mb-4 justify-content-between align-items-center">
                        <div className="col-auto">
                            <input type="email" className="form-control" placeholder="Email Address" defaultValue="johndoe@example.com" />
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
                    <button type="button" className="btn btn-secondary px-5 py-3">Back</button>
                </div>
            </div>
        </div>
    )
}

export default UserView