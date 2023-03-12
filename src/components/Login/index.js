import React from "react";
import "./index.css";

export default function Login() {
  return (
    <div className="login-container">
      <h1>The Beat</h1>
      <form>
        <button type="submit" className="circular-button">
          Login
        </button>
      </form>
    </div>
  );
}
