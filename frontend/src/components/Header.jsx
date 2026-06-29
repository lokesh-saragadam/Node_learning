// Header.jsx
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <span className="logo-dot" />
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
