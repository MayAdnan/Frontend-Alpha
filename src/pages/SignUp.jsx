import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import LogotypeLink from "../partials/components/LogotypeLink";
import { Link } from "react-router-dom";

const SignUp = () => {
  const { CreateAccount } = useAuth();
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const succeeded = await CreateAccount(
      FirstName,
      LastName,
      Email,
      Password,
      ConfirmPassword
    );
    if (succeeded) console.log("Registrering lyckades");
    else console.log("Registrering misslyckades");
  };
  return (
    <div id="signup-page">
      <div id="signup" className="card">
        <div className="section-header">
          <h1> Create Account </h1>
        </div>
        <div className="section-body">
          <form onSubmit={handleSubmit}>
            <div>
              <label>First Name </label>
              <input
                type="text"
                placeholder="Enter your first name"
                value={FirstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div>
              <label>Last Name </label>
              <input
                type="text"
                placeholder="Enter your last name"
                value={LastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div>
              <label>Email </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label>Password </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={ConfirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div>
              <input type="checkbox" required />
              <span>I accept </span>
              <Link to="/auth/termsandconditions"> Terms and conditions </Link>
            </div>

            <button className="btn">Create Account</button>
          </form>
        </div>
        <div className="section-footer">
          <span>Already have an account?</span>
          <Link to="/auth/signin"> Login </Link>
        </div>
      </div>
      <LogotypeLink />
    </div>
  );
};

export default SignUp;
