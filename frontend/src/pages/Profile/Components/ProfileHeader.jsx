import { Link } from "react-router-dom";
import logo from "/ct_vector.jpg";

export default function ProfileHeader() {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt = "code-track-logo"/>
        CodeTrack
      </div>
      <nav className="nav">
        <Link to="/profile/:id">Profile</Link>
      </nav>
    </header>
  );
}