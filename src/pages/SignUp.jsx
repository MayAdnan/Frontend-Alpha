import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LogotypeLink from "../partials/components/LogotypeLink";

const SignUp = () => {
  const { CreateAccount } = useAuth();
  const navigate = useNavigate();
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [Error, setError] = useState("");
  const [TermsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!TermsAccepted) {
      setError("You must accept the terms and conditions");
      return;
    }

    try {
      if (FirstName.trim() === "") {
        setError("Enter your first name");
        return;
      }
      if (LastName.trim() === "") {
        setError("Enter your last name");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(Email)) {
        setError("Enter a valid email address");
        return;
      }
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{10,}$/;
      if (!passwordRegex.test(Password)) {
        setError(
          "Password must be at least 10 characters long and contain at least one letter and one number"
        );
        return;
      }
      if (Password !== ConfirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const succeeded = await CreateAccount(
        FirstName,
        LastName,
        Email,
        Password,
        ConfirmPassword
      );
      if (succeeded) {
        navigate("/auth/signin", { replace: true });
      } else {
        setError("Sign up failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div id="signup-page">
      <div id="signup" className="card">
        <div className="section-header">
          <h1> Create Account </h1>
        </div>
        <div className="section-body">
          <form noValidate onSubmit={handleSubmit}>
            <div>
              <label>First Name </label>
              <input
                type="text"
                placeholder="Enter your first name"
                value={FirstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Last Name </label>
              <input
                type="text"
                placeholder="Enter your last name"
                value={LastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Email </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Password </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={ConfirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="checkbox"
                checked={TermsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                required
              />
              <span>I accept </span>
              <Link to="/auth/termsandconditions"> Terms and conditions </Link>
            </div>

            <button className="btn" type="submit">
              Create Account
            </button>
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
