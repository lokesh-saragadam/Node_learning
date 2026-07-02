import { Link } from "react-router-dom";
import AuthHeader from "./AuthHeader.jsx";

export default function Login() {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    const response = await fetch(
      "http://localhost:3000/api/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );
    const data = await response.json();
    localStorage.setItem("token", data.token);   //in future make it HttpOnly Secure Cookie
    const userId = data.userId;
    if(data.token){
        navigate(`/profile/${userId}`);//redirect to home page after successful login.
    }
    console.log(data);
  };

  return (
    <div className="login-page">
        <AuthHeader/>

        <div className="login-welcome">
            <h1>Welcome Back! </h1>
        </div>
    <div className = "login-container">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" required/>

        <input name="password" type="password" placeholder="Password" required/>

        <button type="submit">Login</button>
      </form>

      <p>
        Don't have an account?
        <Link to="/register"> Register</Link>
      </p>
    </div>
    </div>
  );
}