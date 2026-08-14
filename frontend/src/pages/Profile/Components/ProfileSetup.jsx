import logo from "/ct_vector.jpg";
import { useParams } from "react-router-dom";
import {log} from "../../../utils/logger.js";
import { Link , useNavigate } from "react-router-dom";

export default function ProfileSetup () {
    const navigate = useNavigate();
    const { id } = useParams();
    const userid = Number(id);
    // console.log("userid : " , id);
    log("Profilesetup.jsx","ProfileSetup","Request received");

    const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
        userid: userid,
        platforms: {
            Leetcode: e.target["platforms[Leetcode]"].value,
            Codeforces: e.target["platforms[Codeforces]"].value
        }
    };
    console.log("form Data: ",formData);
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
    })

    const text = await res.text();

    // console.log(text.message);
    log("Profilesetup.jsx","ProfileSetup","Request resolved");
    if(token){
        navigate(`/dashboard/${userid}`);//redirect to home page after successful login.
    }

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