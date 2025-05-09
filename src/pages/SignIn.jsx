import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import LogotypeLink from "../partials/components/LogotypeLink";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const succeeded = await signIn(email, password);
    if (succeeded) {
      navigate("/projects");
    } else {
      setErrorMessage("Failed to sign in. Please check your credentials.");
    }
  };

  return (
    <div className="wrapper-centerscreen">
      <div id="signin">
        <div className="card modal-content content">
          <div className="section-header">
            <h1>Login</h1>
          </div>
          <div className="section-body">
            <form onSubmit={handleSubmit} method="post" noValidate>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button className="btn" type="submit">
                Log In
              </button>
            </form>

            <div className="section-footer">
              <span>Don't have an account?</span>
              <Link to="/auth/signup"> Sign Up </Link>
            </div>
          </div>
        </div>
        <LogotypeLink />
      </div>
    </div>
  );
};

export default SignIn;
