import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import LogotypeLink from "../partials/components/LogotypeLink";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();

  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    var result = await signIn(email, password);
    if (result) {
      navigate("/users");
    }

    setErrorMessage("Invalid email or password");
  };

  return (
    <div className="center-wrapper">
      <div id="login">
        <div className="card">
          <div>{errorMessage}</div>
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit} method="post" noValidate>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-submit">
              Log In
            </button>
          </form>
          <div className="section-footer">
            <span>Don't have an account?</span>
            <Link to="/auth/signup"> Sign Up </Link>
          </div>
        </div>
        <LogotypeLink />
      </div>
    </div>
  );
};

export default SignIn;
