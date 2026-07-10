import logo from "/ct_vector.jpg";
import { useParams } from "react-router-dom";
import {log} from "../utils/logger.js";

export default function ProfileSetup () {
    const { id } = useParams();
    // console.log("userid : " , id);
    log("Profilesetup.jsx","ProfileSetup","Request received");

    const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
        userId: id,
        platforms: {
            Leetcode: e.target["platforms[Leetcode]"].value,
            Codeforces: e.target["platforms[Codeforces]"].value
        }
    };
    console.log("form Data: ",formData);
    fetch(`http://localhost:3000/users/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => console.log(data));
    log("Profilesetup.jsx","ProfileSetup","Request resolved");

}
    return(
        
        <>
        <div className="login-page">
        <div className = "login-container">
        <img src={logo} alt = "code-track-logo"/>
        <form onSubmit={handleSubmit}>

            <input type="text" id="leetcode" name="platforms[Leetcode]" placeholder="Leetcode username" />
            <input type="text" id="codeforces" name="platforms[Codeforces]" placeholder="CodeForces username"/>

            <button type="submit">Submit</button>
        </form>
        </div>
        </div>
        </>
    );
}