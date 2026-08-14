// Header.jsx
import logo from "/ct_vector.jpg";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt = "code-track-logo"/>
        CodeTrack
      </div>
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/login" className="nav-login">Login</Link>
        <Link to="/register"> Register </Link>
      </nav>
    </header>
  );
}
