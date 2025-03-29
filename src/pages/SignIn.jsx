import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import LogotypeLink from "../partials/components/LogotypeLink";
import { Link } from "react-router-dom";

const SignIn = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const succeeded = await signIn(email, password);
    if (succeeded) console.log("inloggning lyckades");
    else console.log("inloggning misslyckades");
  };

  return (
    <div id="signin-page">
      <div id="signin" className="card">
        <div className="section-header">
          <h1>Login</h1>
        </div>
        <div className="section-body">
          <form onSubmit={handleSubmit}>
            <div>
              <label>Email:</label>
              <input
                type="email"
                placeholder="ange din e-post"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label>Password</label>
              <input
                type="password"
                placeholder="ange ditt lösenord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="btn">Logga in</button>
          </form>
        </div>
        <div className="section-footer">
          <span>Don't have an account?</span>
          <Link to="/auth/signup"> Sign Up </Link>
        </div>
      </div>
      <LogotypeLink />
    </div>
  );
};

export default SignIn;
