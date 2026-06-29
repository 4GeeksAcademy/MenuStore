import { Link } from "react-router-dom"

const Register = () => {

    return (<div className="bg-light d-flex justify-content-center align-items-center vh-100">
        <div className="card text-center mt-5">
            <div className="card-header">
                <h3>Register User</h3>
            </div>
            <div className="card-body">
                <div class="mb-3">
                    <label for="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" aria-describedby="emailHelp"/>
                </div>
                <div class="mb-3">
                    <label for="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" aria-describedby="passwordHelp"/>
                </div>
                <div class="mb-3">
                    <label for="user" className="form-label">User Name</label>
                    <input type="text" className="form-control" id="user" aria-describedby="userHelp"/>
                </div>
                <Link to={""} className="btn btn-success">Register</Link>
            </div>
            <div className="card-footer text-body-secondary">
                <Link to={"/login"}>Did you register???</Link>
            </div>
        </div>
    </div>
    )
}

export default Register