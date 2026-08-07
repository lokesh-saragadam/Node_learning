import logo from "/ct_vector.jpg";
import { Link } from "react-router-dom";

export default function OverallHeader() {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt = "code-track-logo"/>
        CodeTrack
      </div>
      <nav className="nav">
        <Link to="/about">About</Link>
        <Link to="/profile" className="nav-login">Profile</Link>
        <Link to="/Git"> GitHub </Link>
      </nav>
    </header>
  );
}