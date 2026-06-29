

const UserView = () => {
    return (
        <div className="container">
            <div className="card text-center shadow-sm">
                <div className="card-header fw-bold text-secondary">
                    User Profile View
                </div>

                <div className="card-body">
                    <div className="row border-bottom py-4 mb-4 justify-content-between align-items-center">
                        <div className="col-auto">
                            <img
                                src="https://unsplash.com"
                                className="img-fluid rounded-circle border shadow-sm"
                                alt="User avatar"
                            />
                        </div>
                        <div className="col-auto">
                            <button type="button" className="btn btn-secondary">Edit Avatar</button>
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
                            <div className="btn-group">
                                <button type="button" className="btn btn-primary p-0">
                                    <input type="text" className="form-control form-control-sm border-0 bg-transparent text-white" placeholder="Role" defaultValue="Admin" />
                                </button>
                                <button type="button" className="btn btn-primary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                                    <span className="visually-hidden">Toggle Dropdown</span>
                                </button>
                                <ul className="dropdown-menu">
                                    <li><div className="dropdown-item">Admin</div></li>
                                    <li><div className="dropdown-item">User</div></li>
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