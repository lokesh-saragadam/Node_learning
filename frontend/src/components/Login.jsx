import LoginHeader from "./LoginHeader";
import logo from "/ct_vector.jpg";
export default function Login() {
    function handleSubmit(e) {
    e.preventDefault();

    const formData = {
        username: e.target.username.value,
        platforms: {
            Leetcode: e.target["platforms[Leetcode]"].value,
            Codeforces: e.target["platforms[Codeforces]"].value
        }
    };

    fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => console.log(data));
}
    return(
        
        <>
        <LoginHeader/>
        <div className="login-page">

        <div className="login-welcome">
            <h1>Welcome! Lets get <span className="Highlight">you</span> started ..</h1>
        </div>
        <div className = "login-container">
        <img src={logo} alt = "code-track-logo"/>
        <form onSubmit={handleSubmit}>

            <input type="text" id="username" name="username" placeholder="Username"required />
            <input type="text" id="leetcode" name="platforms[Leetcode]" placeholder="Leetcode username" />
            <input type="text" id="codeforces" name="platforms[Codeforces]" placeholder="CodeForces username"/>

            <button type="submit">Submit</button>
        </form>
        </div>
        </div>
        </>
    );
}