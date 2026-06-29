import { Link } from "react-router-dom";

export default function Register() {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      username: e.target.username.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };

    const response = await fetch(
      "http://localhost:3000/api/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="login-page">

        <div className="login-welcome">
            <h1>Welcome! Lets get <span className="Highlight">you</span> started ..</h1>
        </div>
    <div className = "login-container">
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="username"
          type="text"
          placeholder="Username"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
        />

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account?
        <Link to="/login"> Login</Link>
      </p>
    </div>
    </div>
  );
}