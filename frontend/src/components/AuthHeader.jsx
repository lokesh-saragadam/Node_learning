import { Link } from "react-router-dom";
import logo from "/ct_vector.jpg";

export default function AuthHeader(){
    return (
        <>
        <header className = "login-header">
        <div className="left-header">
            <img src={logo} alt="CodeTrack-Logo"></img>
            <h3>CodeTrack</h3>
            
        </div>
        <div className = "right-header">
            <nav className="nav">
                <Link to="/">Home</Link>
                <Link to="/about" className="nav-about">About</Link>
            </nav>
        </div>
        </header>
        </>
    )
};