import ProfileHeader from "./Components/ProfileHeader.jsx";
import ProfileSetup from "./Components/ProfileSetup.jsx";

export default function ProfilePage(){

    return (
        <div className="ok">
            <ProfileHeader/>
            <main>
                <ProfileSetup/>
            </main>
        </div>
    )
};